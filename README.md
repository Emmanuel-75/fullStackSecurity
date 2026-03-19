# Task Manager App (Authentication + Protected Routes)

A React task manager implementing JWT authentication and protected routes. Demonstrates token handling, Authorization headers, optimistic CRUD operations, and session management. Built with Tailwind for a clean UI and structured to simulate real-world full-stack security.

## Features

### Authentication (JWT-Based)
- Login → POST /auth/login
- Token stored in localStorage
- User data persisted across sessions
- Auto logout after token expiry (30 mins)

### Protected Routes
- Task page restricted to authenticated users
- Unauthorized users redirected to login
- Route-level access control using context

### API Integration (CRUD)
- Fetch tasks from API on load
- Create → POST /todos/add
- Update → PATCH /todos/:id
- Delete → DELETE /todos/:id
- Authorization header attached to requests
- Authorization: Bearer <token>

### Optimistic UI Updates
- Instant UI updates before server response
- Rollback on failed requests
- Temporary IDs replaced with real backend IDs

### State Management
- Global auth state via Context API
- Immutable updates using map and filter
- Separation of auth state and task state

### UI/UX Enhancements
- Login form with validation and loading states
- Error handling with auto-clear
- Toast notifications for actions
- User name displayed in navbar
- Clean, responsive UI with Tailwind CSS

## Tech Stack
- React
- JavaScript (ES6+)
- Tailwind CSS
- Vite
- DummyJSON API

## Purpose
- Simulate real-world authentication flow
- Implement protected frontend routes
- Practice token lifecycle management
- Prepare frontend for secure backend integration

## How to Use

1. Download the file and run `npm run dev` in the terminal or Tap on the live link associated with this folder
2. Use test credentials
    - email: emilys@example.com
    - password: emilyspass