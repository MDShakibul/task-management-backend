## Summary

- **Backend Logic:** Node.js and Express.js
- **Database:** MySQL

## Important Note

> **Note:** The `.env` file and database script are attached with the email. Please ensure you have them before running the project.

## Getting Started

First, clone or dowload this project:

```bash
git colne https://github.com/MDShakibul/task-management-backend.git
```
or click download the button

then stat this commad for install all Package

```bash
npm install
```

last, run the development server:

```bash
npm start
```

## API Lists

### Authentication & User Management Endpoints:
- Register a new user: [http://localhost:5000/api/v1/auth/register](http://localhost:5000/api/v1/auth/register) (POST)
- Verify a new user: [http://localhost:5000/api/v1/auth/signup-verify-otp](http://localhost:5000/api/v1/auth/signup-verify-otp) (POST)
- Authenticate a user and return a token: [http://localhost:5000/api/v1/auth/login](http://localhost:5000/api/v1/auth/login) (POST)
- Retrieve the authenticated user's profile: [http://localhost:5000/api/v1/auth/profile](http://localhost:5000/api/v1/auth/profile) (GET)
- Update the authenticated user's profile: [http://localhost:5000/api/v1/auth/profile](http://localhost:5000/api/v1/auth/profile) (PUT)
- Initiate password recovery (send reset link/email): [http://localhost:5000/api/v1/auth/forgot-password](http://localhost:5000/api/v1/auth/forgot-password) (POST)
- Reset the user’s password using a provided token: [http://localhost:5000/api/v1/auth/reset-password](http://localhost:5000/api/v1/auth/reset-password) (POST)

### Task Management Endpoints:
- Retrieve a list of tasks for the authenticated user: [http://localhost:5000/api/v1/tasks](http://localhost:5000/api/v1/tasks) (GET)
- Retrieve a specific task by ID: [http://localhost:5000/api/v1/tasks/:id](http://localhost:5000/api/v1/tasks/:id) (GET)
- Create a new task: [http://localhost:5000/api/v1/tasks](http://localhost:5000/api/v1/tasks) (POST)
- Update an existing task: [http://localhost:5000/api/v1/tasks/:id](http://localhost:5000/api/v1/tasks/:id) (PUT)
- Delete a task: [http://localhost:5000/api/v1/tasks/:id](http://localhost:5000/api/v1/tasks/:id) (DELETE)



Open [http://localhost:5000](http://localhost:5000) with your browser to see the result.



