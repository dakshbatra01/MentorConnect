# Backend for MentorConnect (development/demo)

This Express backend is a development/demo server that persists users and refresh tokens in MongoDB (via Mongoose) and implements a realistic JWT authentication flow suitable for local end-to-end testing.

Key behaviors
- Passwords are hashed with bcrypt before being stored in MongoDB.
- I issue a short-lived access token (JWT) and a long-lived refresh token (JWT).
- I store the refresh token in a `refreshtokens` collection and rotate it on refresh.
- I set HttpOnly cookies for the access token (path `/`) and the refresh token (path `/api/auth`). The frontend should send requests with credentials (cookies).

Routes
- POST /api/auth/signup
	- Body: { name, role, email, password }
	- Creates a user, issues tokens, sets cookies, and returns { accessToken, user }
- POST /api/auth/login
	- Body: { email, password }
	- Verifies credentials, issues tokens, sets cookies, and returns { accessToken, user }
- POST /api/auth/refresh
	- Uses the HttpOnly refresh cookie to validate and rotate refresh tokens; returns a new access token and sets new cookies.
- POST /api/auth/logout
	- Revokes the refresh token in the DB and clears the cookies.
- GET /api/auth/me
	- Protected: accepts access token from Authorization header or access cookie; returns the current user.
- GET /api/mentors
	- Example protected endpoint that requires a valid access token.

Environment variables
- MONGODB_URI — MongoDB connection string (required for persisting users). Example: `mongodb+srv://user:pass@cluster0.xyz.mongodb.net/mentorconnect`
- JWT_SECRET — secret for signing access tokens
- REFRESH_SECRET — secret for signing refresh tokens
- CORS_ORIGIN — frontend origin (default: http://localhost:5173)
- PORT — port to listen on (default: 4000)

Running locally (development)

1. Install dependencies and set env vars (don't commit `.env`):

```bash
cd server
npm install
# create server/.env or export env vars in your shell
```

2. Start the server:

```bash
node index.js
# or `npm start` if your package.json has a start script
```

3. Quick smoke tests (example curl commands):

```bash
# Signup (saves cookies to /tmp/mc_cookies.txt)
curl -i -X POST -H "Content-Type: application/json" \
	-d '{"name":"Test User","email":"test@local","password":"pass123"}' \
	http://localhost:4000/api/auth/signup -c /tmp/mc_cookies.txt

# Login
curl -i -X POST -H "Content-Type: application/json" \
	-d '{"email":"test@local","password":"pass123"}' \
	http://localhost:4000/api/auth/login -c /tmp/mc_cookies.txt -b /tmp/mc_cookies.txt

# Get current user (uses access cookie)
curl -i http://localhost:4000/api/auth/me -b /tmp/mc_cookies.txt

# Refresh tokens
curl -i -X POST http://localhost:4000/api/auth/refresh -b /tmp/mc_cookies.txt -c /tmp/mc_cookies.txt

# Logout
curl -i -X POST http://localhost:4000/api/auth/logout -b /tmp/mc_cookies.txt
```

Notes and security
- This server is intended for local development and demo purposes. Before using in production:
	- Use a secure secrets management system (do not keep secrets in `.env` files in the repo).
	- Consider hashing refresh tokens in the DB (instead of storing them in plain text) and implement proper rotation and revocation policies.
	- Set cookie `secure` and `sameSite` flags appropriately for your production domain and HTTPS configuration.
