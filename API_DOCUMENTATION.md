# API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: [Your production API URL]
```

## Authentication
All API endpoints except authentication endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Tasks

#### Get All Tasks
```http
GET /tasks
Query Parameters:
- category_id (optional): Filter by category
- status (optional): "completed" or "active"
- priority (optional): "low", "medium", "high"
```

#### Get Single Task
```http
GET /tasks/:taskId
```

#### Create Task
```http
POST /tasks
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the project",
  "priority": "high",
  "category_id": "uuid-of-category"
}
```

#### Update Task
```http
PUT /tasks/:taskId
Content-Type: application/json

{
  "title": "Updated task title",
  "description": "Updated description",
  "priority": "medium",
  "completed": true,
  "category_id": "uuid-of-category"
}
```

#### Delete Task
```http
DELETE /tasks/:taskId
```

#### Update Task Priority
```http
PATCH /tasks/:taskId/priority
Content-Type: application/json

{
  "priority": "high"
}
```

#### Toggle Task Completion
```http
PATCH /tasks/:taskId/toggle
```

### Categories

#### Get All Categories
```http
GET /categories
```

#### Get Single Category
```http
GET /categories/:categoryId
```

#### Create Category
```http
POST /categories
Content-Type: application/json

{
  "name": "Work",
  "color": "#FF5733",
  "icon": "fa-briefcase"
}
```

#### Update Category
```http
PUT /categories/:categoryId
Content-Type: application/json

{
  "name": "Personal",
  "color": "#33FF57",
  "icon": "fa-user"
}
```

#### Delete Category
```http
DELETE /categories/:categoryId
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

## Error Codes
- `AUTH_ERROR`: Authentication related errors
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `FORBIDDEN`: User doesn't have permission
- `SERVER_ERROR`: Internal server error

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user

## Data Models

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}
```

## WebSocket Events
Real-time updates are available through Supabase subscriptions:

### Task Updates
```javascript
supabase
  .from('tasks')
  .on('*', payload => {
    console.log('Change received!', payload)
  })
  .subscribe()
```

## Examples

### Creating a Task with cURL
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "priority": "high",
    "category_id": "category-uuid"
  }'
```

### Filtering Tasks with cURL
```bash
curl http://localhost:3000/api/tasks?priority=high&status=active \
  -H "Authorization: Bearer <your_jwt_token>"
``` 