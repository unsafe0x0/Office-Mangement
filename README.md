# Office Management API

This API provides endpoints for managing office operations, including employee management, task management, payroll processing, attendance management, notification management, and leave management.

## Endpoints

### Admin Management

- **POST** `/admin/login`: Admin login endpoint.
- **POST** `/admin/register`: Register a new admin.
- **PUT** `/admin/update`: Update admin information (requires authentication).
- **DELETE** `/admin/delete`: Delete an admin (requires authentication).
- **GET** `/admin/dashboard`: Get admin dashboard information (requires authentication).

### Employee Management

- **POST** `/employee/login`: Employee login endpoint.
- **POST** `/employee/register`: Register a new employee (requires authentication).
- **PUT** `/employee/update`: Update employee information (requires authentication).
- **DELETE** `/employee/delete`: Delete an employee (requires authentication).
- **GET** `/employee/info`: Get information about the authenticated employee (requires authentication).
- **GET** `/employee/all`: Get information about all employees (requires authentication).

### Attendance Management

- **POST** `/attendance/mark`: Mark attendance for an employee (requires authentication).
- **PUT** `/attendance/update`: Update attendance information (requires authentication).

### Leave Management

- **POST** `/leave/new`: Apply for a new leave (requires authentication).
- **PUT** `/leave/update`: Update leave information (requires authentication).
- **DELETE** `/leave/delete`: Delete a leave request (requires authentication).

### Notification Management

- **POST** `/notification/new`: Create a new notification (requires authentication).
- **PUT** `/notification/update`: Update an existing notification (requires authentication).
- **DELETE** `/notification/delete`: Delete a notification (requires authentication).

### Payroll Management

- **POST** `/payroll/new`: Create a new payroll entry (requires authentication).
- **PUT** `/payroll/update`: Update payroll information (requires authentication).
- **DELETE** `/payroll/delete`: Delete a payroll entry (requires authentication).

### Task Management

- **POST** `/task/new`: Create a new task (requires authentication).
- **PUT** `/task/update`: Update an existing task (requires authentication).
- **DELETE** `/task/delete`: Delete a task (requires authentication).


## Installation

```bash
git clone https://github.com/unsafe0x0/office-management.git
cd office-management
bun install
bun run dev
```

## Authentication

All endpoints marked with "requires authentication" need a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
    "success": boolean,
    "message": string,
    "data": object | null
}
```

## Error Codes

- **200**: OK - Successful request
- **201**: Created - Resource successfully created
- **400**: Bad Request - Invalid input parameters
- **401**: Unauthorized - Authentication required or invalid token
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server-side error

## Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
PORT=3000
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
CORS_ORIGIN="your_cors_origin"
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request