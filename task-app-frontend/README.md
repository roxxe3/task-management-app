# Task Management App Frontend

This frontend application provides a user interface for managing tasks with React and Vite.

## API Integration Notice

The frontend attempts to use the following authentication endpoints:

- `POST /api/auth/signup` - Register a new user ✅ *Implemented*
- `POST /api/auth/login` - Authenticate user & get token ✅ *Implemented*
- `GET /api/auth/validate-token` - Validate user token ✅ *Implemented*
- `POST /api/auth/logout` - Log out user ✅ *Implemented*
- `POST /api/auth/confirm-email` - Confirm user email ⚠️ *Not implemented in backend*
- `POST /api/auth/resend-verification` - Resend verification email ⚠️ *Not implemented in backend*

**⚠️ IMPORTANT**: The frontend code expects endpoints for email verification that are not currently implemented in the backend. For full functionality, implement these endpoints in the backend `auth.js` file.

## Development

To start the development server:

```bash
npm run dev
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
