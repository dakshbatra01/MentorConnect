const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const http = require("http");
const authRoutes = require('./routes/auth.js');
const mentorRoutes = require('./routes/mentor.js');
const sessionRoutes = require('./routes/session.js');
const feedbackRoutes = require('./routes/feedback.js');
const adminRoutes = require('./routes/admin.js');
const notificationRoutes = require('./routes/notifications.js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// My CORS configuration with production and development origins
// My CORS configuration with production and development origins
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:3000",
    "https://mentor-connect-azure.vercel.app" // Explicitly allow the user's Vercel app
];

// My environment-specific origin handling
if (process.env.ORIGIN) {
    // Support comma-separated origins in the environment variable
    const envOrigins = process.env.ORIGIN.split(',').map(origin => origin.trim());
    allowedOrigins.push(...envOrigins);
}

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin); // Log blocked origins for debugging
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token']
}));

app.use(express.json());

app.use('/api/auth/', authRoutes);
app.use('/api/mentor/', mentorRoutes);
app.use('/api/session/', sessionRoutes);
app.use('/api/feedback/', feedbackRoutes);
app.use('/api/admin/', adminRoutes);
app.use('/api/notifications/', notificationRoutes);

// My graceful server startup with proper error handling
const startServer = async () => {
    try {
        // My MongoDB connection first
        await connectDB();

        const PORT = process.env.PORT || 4000;
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();



