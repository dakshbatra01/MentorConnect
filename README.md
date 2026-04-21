# MentorConnect

## 1. Project Title
**MentorConnect** – A Student–Mentor Matching and Learning Platform

## 2. Problem Statement
Finding the right mentor in academia or skill development can be challenging. Students often struggle to connect with professionals or peers who can guide them effectively. MentorConnect aims to bridge this gap by creating a digital platform that connects students with mentors based on interests, expertise, and learning goals. The system promotes structured mentorship through verified profiles, scheduling, and feedback.

## 3. System Architecture
**Frontend**  **Backend (API)**  **Database**

**Architecture Stack:**
*   **Frontend:** React.js with React Router for multiple pages (Home, Dashboard, Mentor List, Profile)
*   **Backend:** Node.js + Express.js REST API
*   **Database:** MongoDB Atlas (non-relational)
*   **Authentication:** JWT-based secure login/signup for both students and mentors
*   **Hosting:**
    *   Frontend  Vercel / Netlify
    *   Backend  Render / Railway
    *   Database  MongoDB Atlas

## 4. Key Features

| Category | Features |
| :--- | :--- |
| **Authentication & Authorization** | Secure JWT login/signup for students and mentors; role-based access control. |
| **CRUD Operations** | Create, Read, Update, Delete mentor profiles, requests, and feedback. |
| **Filtering & Searching** | Filter mentors by domain, experience level, and location; search by skill or name. |
| **Sorting & Pagination** | Sort mentors by rating or experience; paginate mentor listings. |
| **Booking System** | Students can request mentorship sessions; mentors approve or reject requests. |
| **Feedback System** | Students can leave feedback after mentorship sessions. |
| **Frontend Routing** | Home, Login, Dashboard, Mentor Directory, Profile, Feedback pages. |
| **Hosting** | Frontend & Backend deployed with public URLs. |

## 5. Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, React Router, Axios, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Authentication** | JWT Authentication |
| **Hosting** | Vercel (Frontend), Render/Railway (Backend), MongoDB Atlas (Database) |

## 6. API Overview

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/auth/signup` | POST | Register new user (mentor/student) | Public |
| `/api/auth/login` | POST | Authenticate user and return token | Public |
| `/api/session/book` | POST | Book a new mentorship session | Authenticated |
| `/api/feedback/create` | POST | Submit feedback for a completed session | Authenticated |
| `/api/mentor/profile` | POST | Create a new mentor profile | Authenticated |
| `/api/mentor/all` | GET | Retrieve mentors with filtering, sorting, pagination | Authenticated |
| `/api/session/my-sessions` | GET | Get the logged-in user's sessions | Authenticated |
| `/api/admin/analytics/overview` | GET | Get admin dashboard statistics | Admin |
| `/api/auth/getuser` | GET | Get the current logged-in user's details | Authenticated |
| `/api/feedback/mentor/:mentorId` | GET | Get all reviews for a specific mentor | Authenticated |
| `/api/auth/profile` | PUT | Update user profile details | Authenticated |
| `/api/session/:id/status` | PUT | Update session status (e.g., confirm, complete) | Authenticated |
| `/api/mentor/availability` | PUT | Update mentor's available time slots | Authenticated |
| `/api/admin/users/:id/role` | PUT | Change a user's role | Admin |
| `/api/notifications/:id/read` | PUT | Mark a notification as read | Authenticated |
| `/api/session/:id` | DELETE | Cancel/Delete a session | Authenticated |
| `/api/feedback/:id` | DELETE | Delete a specific feedback entry | Authenticated |
| `/api/admin/users/:id` | DELETE | Delete a user account | Admin |
| `/api/mentor/profile` | DELETE | Delete the logged-in user's mentor profile | Authenticated |
| `/api/admin/feedback/:id` | DELETE | Delete any feedback | Admin |

---

**Hosted Frontend URL:** https://mentor-connect-azure.vercel.app
