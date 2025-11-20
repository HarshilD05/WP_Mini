# API Integration Documentation

## Overview
This document describes the complete API integration for the Event Permission System frontend, connecting to the backend server at `http://localhost:5000`.

## Environment Configuration

### Files Created
- `.env` - Contains `VITE_SERVER_URL=http://localhost:5000`
- `.env.example` - Template for environment variables

### Usage
Access the server URL in code using:
```javascript
const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
```

## API Modules

### 1. Authentication API (`src/apis/authAPI.js`)

#### Functions

##### `login(email, password)`
- **Endpoint**: `POST /api/auth/login`
- **Request Body**: `{ email, password }`
- **Response**: `{ token, userId, name, email, role, committee }`
- **Storage**: Stores JWT token in `localStorage` as `authToken`
- **Usage**: Called from `Login.jsx`

##### `register(name, email, password, role, committee, sign)`
- **Endpoint**: `POST /api/auth/register`
- **Content-Type**: `multipart/form-data` (automatic with FormData)
- **Form Fields**:
  - `name` (string)
  - `email` (string)
  - `password` (string)
  - `role` (string): "committee", "teacher", or "admin"
  - `committee` (string, optional): Required for committee role
  - `sign` (File): User photo/signature file
- **Response**: `{ message, userId }`
- **Usage**: Called from registration form

##### `logout()`
- Clears JWT token from `localStorage`
- Clears user session data from `sessionStorage`

---

### 2. Request API (`src/apis/requestAPI.js`)

#### Helper Function
```javascript
getAuthHeaders()
```
Returns headers with JWT token:
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>'
}
```

#### Functions

##### `createRequest(requestData)`
- **Endpoint**: `POST /api/requests/create`
- **Request Body**:
```javascript
{
  title: string,
  description: string,
  committee: string,
  venue: string,
  date: string (YYYY-MM-DD),
  startTime: string (HH:MM),
  endTime: string (HH:MM)
}
```
- **Response**: Created request object
- **Usage**: Called from `RequestForm.jsx` via `submitRequest` wrapper

##### `getMyRequests()`
- **Endpoint**: `GET /api/requests/me`
- **Description**: Fetches requests for the authenticated user's committee
- **Response**: Array of request objects
- **Usage**: Called from `StudentHome.jsx`

##### `getAllRequests(status?)`
- **Endpoint**: `GET /api/requests` or `GET /api/requests?status=<status>`
- **Query Parameters**: 
  - `status` (optional): Filter by "pending", "approved", "rejected", or "complete"
- **Response**: Array of request objects
- **Usage**: Called from `TeacherHome.jsx`

##### `approveRequest(reqId)`
- **Endpoint**: `PUT /api/requests/{reqId}/approve`
- **Response**: Updated request object
- **Usage**: Called from `TeacherHome.jsx` approve button

##### `rejectRequest(reqId, reason)`
- **Endpoint**: `PUT /api/requests/{reqId}/reject`
- **Request Body**: `{ reason: string }`
- **Response**: Updated request object
- **Usage**: Called from `TeacherHome.jsx` reject modal

##### `submitRequest(formData)` [Legacy Wrapper]
- Wrapper function that calls `createRequest()`
- Maintained for backward compatibility

---

### 3. Calendar API (`src/apis/calendarAPI.js`)

#### Functions

##### `getCalendarMonth(yearMonth)`
- **Endpoint**: `GET /api/requests/getCalendar/{yearMonth}`
- **Parameter**: `yearMonth` in format "YYYY-MM" (e.g., "2025-01")
- **Response**: Array of events for the entire month
- **Usage**: Called from calendar month view

##### `getCalendarDay(yearMonth, day)`
- **Endpoint**: `GET /api/requests/getCalendar/{yearMonth}/{day}`
- **Parameters**:
  - `yearMonth`: "YYYY-MM" format
  - `day`: Day number (1-31)
- **Response**: Array of events for that specific day
- **Usage**: Called from calendar day detail view

##### `getRequestsByMonth(year, month)` [Legacy Helper]
- Converts parameters to `yearMonth` format and calls `getCalendarMonth()`
- **Parameters**: `year` (number), `month` (1-12)
- **Usage**: Maintains backward compatibility with `CalendarView.jsx`

##### `getRequestsByDate(year, month, day)` [Legacy Helper]
- Converts parameters and calls `getCalendarDay()`
- **Parameters**: `year` (number), `month` (1-12), `day` (1-31)

---

## Component Updates

### Updated Components

#### 1. `StudentHome.jsx`
- **Change**: Replaced mock data with `getMyRequests()` API call
- **Effect**: Fetches actual committee-specific requests on mount
- **Error Handling**: Console logs errors, gracefully handles failures

#### 2. `TeacherHome.jsx`
- **Changes**:
  - Replaced mock data with `getAllRequests()` API call
  - Updated `handleApprove()` to use `approveRequest()` API
  - Updated `handleReject()` to use `rejectRequest()` API
  - Added automatic list refresh after approve/reject actions
- **Error Handling**: Console logs + user alerts for failures

#### 3. `Login.jsx`
- **Status**: Already using updated `authAPI.login()`
- **Storage**: Stores user data in `sessionStorage`

#### 4. `RequestForm.jsx`
- **Status**: Using `submitRequest()` wrapper (which calls `createRequest()`)
- **No changes needed**: Backward compatible

#### 5. `CalendarView.jsx`
- **Status**: Using legacy helper `getRequestsByMonth()`
- **Backend**: Helper now calls `getCalendarMonth()` API

---

## Data Flow

### Authentication Flow
```
Login.jsx 
  → authAPI.login(email, password)
  → POST /api/auth/login
  → Store token in localStorage
  → Store user info in sessionStorage
  → Navigate to dashboard
```

### Request Creation Flow
```
RequestForm.jsx
  → submitRequest(formData)
  → createRequest(formData)
  → POST /api/requests/create
  → Return to dashboard
```

### Request Approval Flow (Teacher)
```
TeacherHome.jsx
  → Load requests: getAllRequests()
  → Display in UI
  → User clicks Approve
  → approveRequest(reqId)
  → PUT /api/requests/{reqId}/approve
  → Refresh list: getAllRequests()
```

### Request Rejection Flow (Teacher)
```
TeacherHome.jsx
  → User enters rejection reason
  → rejectRequest(reqId, reason)
  → PUT /api/requests/{reqId}/reject
  → Refresh list: getAllRequests()
```

---

## Error Handling

### All API functions implement:
1. **Try-Catch Blocks**: Wrap fetch calls
2. **Response Validation**: Check `response.ok`
3. **Error Parsing**: Parse error JSON when available
4. **Error Throwing**: Throw errors for caller handling
5. **Console Logging**: Log errors in component handlers
6. **User Feedback**: Alert messages for critical failures

### Example Pattern:
```javascript
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  return await response.json();
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

---

## Authentication Headers

### All authenticated requests include:
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <JWT_TOKEN>'
}
```

### Token is retrieved from:
```javascript
localStorage.getItem('authToken')
```

---

## Response Structure

### Request Object Structure
```javascript
{
  id: string,              // e.g., "REQ-2025-001"
  eventName: string,
  committee: string,
  date: string,            // YYYY-MM-DD
  time: string,            // "HH:MM AM/PM - HH:MM AM/PM"
  location: string,
  status: string,          // "pending" | "approved" | "rejected" | "complete"
  approvalStage: number,   // 1-5
  description: string,
  rejectedAt: number,      // Stage where rejected
  rejectionReason: string,
  submittedOn: string,
  reviewedOn: string,
  reviewedBy: string
}
```

---

## Next Steps

### To complete the integration:

1. **Start Backend Server**
   - Ensure backend is running on `http://localhost:5000`
   - Verify all API endpoints are implemented

2. **Test API Endpoints**
   - Test login/register flows
   - Test request CRUD operations
   - Test approve/reject workflows
   - Test calendar data retrieval

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update `VITE_SERVER_URL` if backend runs on different port

4. **CORS Configuration**
   - Backend must allow requests from Vite dev server (default: `http://localhost:5173`)

5. **Additional Features** (Future)
   - Implement refresh token mechanism
   - Add request caching/optimistic updates
   - Implement WebSocket for real-time updates
   - Add file upload progress indicators
   - Implement retry logic for failed requests

---

## Development Notes

### Testing Without Backend
Current state: All components will attempt API calls. If backend is not running:
- Login will fail with network error
- Requests will not load
- Actions will fail

### Mock Mode (Optional Future Enhancement)
Consider adding a development flag:
```javascript
const USE_MOCK_DATA = import.meta.env.DEV && !import.meta.env.VITE_SERVER_URL;
```

---

## File Checklist

✅ `.env` - Created  
✅ `.env.example` - Created  
✅ `src/apis/authAPI.js` - Updated with real endpoints  
✅ `src/apis/requestAPI.js` - Updated with real endpoints  
✅ `src/apis/calendarAPI.js` - Updated with real endpoints  
✅ `src/pages/Login.jsx` - Using updated authAPI  
✅ `src/pages/StudentHome.jsx` - Using getMyRequests()  
✅ `src/pages/TeacherHome.jsx` - Using getAllRequests(), approveRequest(), rejectRequest()  
✅ `src/pages/RequestForm.jsx` - Using submitRequest() wrapper  
✅ `src/pages/CalendarView.jsx` - Using legacy helpers (now call new APIs)  
✅ `src/components/ApprovalProgress.jsx` - Already created  
✅ `src/components/ApprovalProgress.css` - Already created  

---

**Integration Status**: ✅ COMPLETE

All mock data has been replaced with actual API calls. The application is ready to connect to the backend server.
