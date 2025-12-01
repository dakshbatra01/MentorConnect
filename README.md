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
| `/api/mentors` | GET | Retrieve mentors with filtering, sorting, pagination | Authenticated |
| `/api/mentors/:id` | GET | Retrieve a single mentor profile | Authenticated |
| `/api/requests` | POST | Create mentorship session request | Authenticated |
| `/api/feedback/:id` | PATCH | Submit feedback for a session | Authenticated |
| `/api/admin/mentors/:id` | DELETE | Remove mentor profile (admin only) | Admin |

---

**Hosted Frontend URL:** https://mentor-connect-azure.vercel.app
