# Authentication Flow Test Guide

## Testing the Authentication Flow

The app now implements session-based authentication with role-based routing:

### Session Storage Keys
- `userId`: User's unique identifier
- `userRole`: User role (`admin`, `student`, or `teacher`)
- `userName`: User's display name

### Testing in Browser Console

To test without a backend, open browser console and run:

```javascript
// Login as Admin
sessionStorage.setItem('userId', '1');
sessionStorage.setItem('userRole', 'admin');
sessionStorage.setItem('userName', 'Admin User');
window.location.href = '/';

// Login as Student
sessionStorage.setItem('userId', '2');
sessionStorage.setItem('userRole', 'student');
sessionStorage.setItem('userName', 'Student User');
window.location.href = '/';

// Login as Teacher
sessionStorage.setItem('userId', '3');
sessionStorage.setItem('userRole', 'teacher');
sessionStorage.setItem('userName', 'Teacher User');
window.location.href = '/';

// Logout (clear session)
sessionStorage.clear();
localStorage.clear();
window.location.href = '/login';
```

### Flow Behavior

1. **Opening the app** (`/`):
   - If no session data → Redirect to `/login`
   - If session exists → Redirect to role-specific home:
     - Admin → `/admin`
     - Student → `/dashboard`
     - Teacher → `/teacher-dashboard`

2. **Login Page** (`/login`):
   - Currently uses mock authentication
   - Sets session storage with user data
   - Redirects to `/` which then routes to role-specific page

3. **Protected Routes**:
   - All routes except `/login` and `/signup` require authentication
   - Unauthenticated users are redirected to `/login`

4. **Logout**:
   - Click profile icon → Logout
   - Clears session and local storage
   - Redirects to `/login`

### Current Mock User
The mock login in `authAPI.js` returns:
- userId: '123'
- role: 'admin'
- name: 'Admin User'

You can modify the role in `authAPI.js` to test different user types.
