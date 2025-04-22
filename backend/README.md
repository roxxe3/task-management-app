# Task Management App Backend

This is the backend API for the Task Management application.

## API Routes Documentation

### Authentication Endpoints

Currently implemented endpoints:

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/validate-token` - Validate user token and return user data
- `POST /api/auth/logout` - Log out user and invalidate session

Endpoints **expected by frontend but not implemented** in backend:

- `POST /api/auth/confirm-email` - Confirm user email with token
- `POST /api/auth/resend-verification` - Resend verification email

### Task Endpoints

- `GET /api/tasks` - Get all tasks with optional filtering
- `GET /api/tasks/:id` - Get a specific task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/categories/unique` - Get all unique categories used in tasks
- `PUT /api/tasks/:id/position` - Update task position

### Category Endpoints

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a specific category by ID
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update an existing category
- `DELETE /api/categories/:id` - Delete a category

## Development

To start the development server:

```bash
npm run dev
```

## Database

The backend uses Supabase as the database service. Make sure to set up your Supabase credentials in the `.env` file. 