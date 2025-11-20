# Authentication Pages

This document describes the login and signup pages implementation.

## Pages Created

### 1. Login Page (`/login`)
- **Location**: `src/pages/Login.jsx` and `src/pages/Login.css`
- **Features**:
  - Email and password input fields
  - Form validation
  - Error handling and display
  - Loading state during API calls
  - Link to signup page
  - Responsive design

### 2. Signup Page (`/signup`)
- **Location**: `src/pages/Signup.jsx` and `src/pages/Signup.css`
- **Features**:
  - Full name, email, password, and confirm password fields
  - Client-side validation (email format, password length, password match)
  - Error handling and display
  - Loading state during API calls
  - Link to login page
  - Responsive design

## API Module

### Auth API (`src/apis/authAPI.js`)
Provides the following functions:
- `login({ email, password })` - Authenticate user
- `signup({ name, email, password })` - Register new user
- `logout()` - Clear user session
- `getCurrentUser()` - Get logged-in user from localStorage
- `getToken()` - Get auth token
- `isAuthenticated()` - Check if user is logged in

## Design Features

- **Professional gradient background** (purple to violet)
- **Clean white card** with rounded corners and shadow
- **Smooth animations** on button hover
- **Focus states** with colored borders
- **Error messages** with red styling
- **Responsive layout** for mobile devices
- **Disabled states** during form submission
- **Accessible form inputs** with proper labels

## Routes

The following routes are now available:
- `/login` - Login page
- `/signup` - Signup page

## Configuration

Create a `.env` file based on `.env.example`:
```
VITE_API_URL=http://localhost:5000/api
```

## Usage

1. Navigate to `/login` to sign in
2. Navigate to `/signup` to create a new account
3. After successful authentication, user is redirected to home page (`/`)
4. Auth token and user data are stored in localStorage

## Integration with Backend

The auth pages expect the following API endpoints:
- `POST /api/auth/login` - Login endpoint
- `POST /api/auth/signup` - Signup endpoint

Make sure your backend server is running and accessible at the URL specified in your `.env` file.
