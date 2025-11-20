import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Home from './pages/Home'
import RequestForm from './pages/RequestForm'
import Login from './pages/Login'
import StudentHome from './pages/StudentHome'
import TeacherHome from './pages/TeacherHome'
import CalendarView from './pages/CalendarView';
import AdminHome from './pages/admin/AdminHome';
import ManageUsers from './pages/admin/ManageUsers';
import AdminUserProfile from './pages/admin/UserProfile';
import UserProfile from './pages/UserProfile';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import './colors.css'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  
  // Load user data from session storage
  useEffect(() => {
    const role = sessionStorage.getItem('userRole') || 'admin';
    const name = sessionStorage.getItem('userName') || 'Admin User';
    setUserRole(role);
    setUserName(name);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Root route - redirects based on role */}
          <Route path="/" element={
            <ProtectedRoute>
              <RoleBasedRedirect />
            </ProtectedRoute>
          } />

          {/* Protected routes with layout */}
          <Route path="/*" element={
            <ProtectedRoute>
              <>
                <Navbar 
                  onToggleSidebar={toggleSidebar} 
                  userRole={userRole}
                  userName={userName}
                />
                <Sidebar 
                  isOpen={sidebarOpen} 
                  onClose={closeSidebar}
                  userRole={userRole}
                />
                <main className="main-content">
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/request-form" element={<RequestForm />} />
                    <Route path="/dashboard" element={<StudentHome />} />
                    <Route path="/teacher-dashboard" element={<TeacherHome />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/admin" element={<AdminHome />} />
                    <Route path="/admin/manage-users" element={<ManageUsers />} />
                    <Route path="/admin/user/:id" element={<AdminUserProfile />} />
                  </Routes>
                </main>
              </>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
