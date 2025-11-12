const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-mentorconnect'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'dev-refresh-secret-mentorconnect'

// Configure CORS to allow multiple origins
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'https://mentor-connect-azure.vercel.app']

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    
    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      // In development, allow localhost on any port
      if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:')) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type']
}

app.use(cors(corsOptions))
app.use(express.json())

// I register cookie parser before routes that read cookies
const cookieParser = require('cookie-parser')
app.use(cookieParser())

// I define MongoDB models first (before connection to prevent index creation timeout)
const userSchema = new mongoose.Schema({
  name: String,
  role: { type: String, default: 'student' },
  email: { type: String, unique: true },
  password: String,
}, { 
  timestamps: true,
  autoIndex: false // Disable auto-index to prevent timeout, we'll create manually after connection
})

const refreshTokenSchema = new mongoose.Schema({
  // store only a hash of the refresh token (never store raw token)
  tokenHash: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
}, {
  autoIndex: false // Disable auto-index to prevent timeout
})

const User = mongoose.model('User', userSchema)
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema)

// connect to MongoDB, log the effective URI (masked) and only start the HTTP server after DB connects
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mentorconnect'
const maskedUri = (MONGODB_URI || '').replace(/(:\/\/).*@/, '$1****@')
console.info('Using MONGODB_URI:', maskedUri)

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
}).then(async () => {
  if (process.env.NODE_ENV !== 'test') console.info('Connected to MongoDB')
  // Create indexes after connection is established
  try {
    await User.createIndexes()
    await RefreshToken.createIndexes()
    if (process.env.NODE_ENV !== 'test') console.info('Database indexes created')
  } catch (indexErr) {
    console.error('Error creating indexes:', indexErr)
    // Continue anyway - indexes might already exist
  }
  // start HTTP server only after DB connection succeeds
  app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'test') console.info(`Backend listening on http://localhost:${PORT}`)
  })
}).catch(err => {
  console.error('MongoDB connection error', err)
  // still start the server so errors are visible, but warn clearly
  app.listen(PORT, () => {
    console.error(`Started HTTP server on http://localhost:${PORT} but DB connection failed`)
  })
})

function generateAccessToken(user) {
  return jwt.sign({ id: user._id || user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '15m' })
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user._id || user.id }, REFRESH_SECRET, { expiresIn: '7d' })
}

// I create a user, hash the password, and return tokens
app.post('/api/auth/signup', async (req, res) => {
  const { name, role = 'student', email, password } = req.body || {}
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' })
  }
  // basic email and password validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' })
  }
  // password: at least one digit, at least one special char, min length 8
  const pwdRegex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/\?]).{8,}$/
  if (!pwdRegex.test(password)) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long and include at least one number and one special character' })
  }
  const exists = await User.findOne({ email }).exec()
  if (exists) return res.status(409).json({ message: 'User already exists' })
  const hashed = await bcrypt.hash(password, 10)
  const user = new User({ name, role, email, password: hashed })
  await user.save()

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  // hash refresh token before persisting
  const tokenHash = await bcrypt.hash(refreshToken, 10)
  await RefreshToken.create({ tokenHash, userId: user._id, expiresAt })

  // I set tokens as HttpOnly cookies             
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60 * 1000,
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  return res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
})

// I accept email/password and return tokens
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ message: 'email and password required' })
  const user = await User.findOne({ email }).exec()
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  // hash refresh token before persisting
  const tokenHash = await bcrypt.hash(refreshToken, 10)
  await RefreshToken.create({ tokenHash, userId: user._id, expiresAt })

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60 * 1000,
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  return res.json({ accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
})

// I refresh the access token using the refresh token cookie
app.post('/api/auth/refresh', async (req, res) => {
  const token = req.cookies && req.cookies.refreshToken
  if (!token) return res.status(401).json({ message: 'Missing refresh token' })
  try {
    // verify token to obtain user id
    const payload = jwt.verify(token, REFRESH_SECRET)
    const user = await User.findById(payload.id).exec()
    if (!user) return res.status(404).json({ message: 'User not found' })

    // find candidate refresh token docs for the user and compare hashes
    const candidates = await RefreshToken.find({ userId: user._id }).exec()
    let stored = null
    for (const c of candidates) {
      // compare provided token with stored hash
      // eslint-disable-next-line no-await-in-loop
      if (await bcrypt.compare(token, c.tokenHash)) { stored = c; break }
    }
    if (!stored) return res.status(403).json({ message: 'Refresh token revoked' })

    // rotate refresh token: remove old, create new
    await RefreshToken.deleteOne({ _id: stored._id }).exec()
    const newRefresh = generateRefreshToken(user)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const newHash = await bcrypt.hash(newRefresh, 10)
    await RefreshToken.create({ tokenHash: newHash, userId: user._id, expiresAt })

    const accessToken = generateAccessToken(user)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    })
    res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({ accessToken })
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' })
  }
})

// I revoke the refresh token and clear cookies on logout
app.post('/api/auth/logout', async (req, res) => {
  const token = req.cookies && req.cookies.refreshToken
  if (token) {
    try {
      const payload = jwt.verify(token, REFRESH_SECRET)
      const user = await User.findById(payload.id).exec()
      if (user) {
        const candidates = await RefreshToken.find({ userId: user._id }).exec()
        for (const c of candidates) {
          // eslint-disable-next-line no-await-in-loop
          if (await bcrypt.compare(token, c.tokenHash)) {
            await RefreshToken.deleteOne({ _id: c._id }).exec()
            break
          }
        }
      }
    } catch (e) {
      // ignore malformed token
    }
  }
  res.clearCookie('refreshToken', { path: '/api/auth' })
  res.clearCookie('accessToken', { path: '/' })
  return res.json({ ok: true })
})

// I expose a protected route that uses the access token
app.get('/api/auth/me', async (req, res) => {
  // I accept an access token from the Authorization header or from a cookie
  const auth = req.headers['authorization'] || ''
  const m = auth.match(/^Bearer (.+)$/)
  const token = m ? m[1] : (req.cookies && req.cookies.accessToken)
  if (!token) return res.status(401).json({ message: 'Missing token' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(payload.id).exec()
    if (!user) return res.status(404).json({ message: 'User not found' })
    return res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
})

// I expose a small protected mentors list
app.get('/api/mentors', async (req, res) => {
  // I require an access token (from header or cookie)
  const auth = req.headers['authorization'] || ''
  const m = auth.match(/^Bearer (.+)$/)
  const token = m ? m[1] : (req.cookies && req.cookies.accessToken)
  if (!token) return res.status(401).json({ message: 'Missing token' })
  try {
    jwt.verify(token, JWT_SECRET)
    return res.json({ mentors: [ { id:1, name:'Dr. Aisha Khan', skill:'Data Science' }, { id:2, name:'Ravi Patel', skill:'Frontend' } ] })
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
})

// I already registered cookieParser above

// NOTE: server is started after attempting DB connection above
