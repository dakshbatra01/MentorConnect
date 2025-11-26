# MentorConnect — Frontend

This repo contains the frontend for MentorConnect built with Vite + React + Tailwind.

## What's included
- Login and Signup pages wired to an Axios service
- TailwindCSS setup
- Axios instance that reads `VITE_API_URL` for the backend

## Local development
1. Install dependencies

```bash
# macOS / zsh
npm install
```

2. Start dev server

```bash
npm run dev
```

The app will open on http://localhost:5173 by default.

## Environment
Create a `.env` file (or set env vars in your host) with:

```
VITE_API_URL=http://localhost:4000
```

This URL should point to your running backend (the Express API). The frontend expects the following endpoints:
- POST /api/auth/signup -> returns { token, user }
- POST /api/auth/login -> returns { token, user }

Adjust the endpoints if your backend uses different paths.

## Deployment (Frontend)
You can deploy the frontend to Vercel or Netlify.

- Vercel: connect the repo, set the `VITE_API_URL` environment variable in the project settings, and deploy.
- Netlify: same idea — set the `VITE_API_URL` env var and deploy the build folder.

Build command: `npm run build`
Publish folder: `dist`

## Backend & Database hosting
I recommend deploying the backend to Render or Railway and use MongoDB Atlas for the database. Make sure the backend exposes the `/api/auth/*` endpoints and returns JSON with `token`.

## Next steps
- Implement mentor directory pages and protected routes
- Add client-side validation and better error handling
- Add unit tests and E2E tests for auth flows

