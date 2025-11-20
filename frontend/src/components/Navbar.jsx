import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, UserCircle } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ onToggleSidebar, userRole = 'admin', userName = 'Admin User' }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session and local storage
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userName');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleViewProfile = () => {
    setShowProfileMenu(false);
    // Navigate to user's own profile
    const userId = sessionStorage.getItem('userId');
    navigate(`/profile/${userId}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          <Menu size={24} />
        </button>
        <h1 className="navbar-title">ApproveFlow</h1>
      </div>

      <div className="navbar-right">
        <div className="profile-section">
          <button 
            className="profile-button" 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <UserCircle size={32} />
          </button>

          {showProfileMenu && (
            <>
              <div className="profile-backdrop" onClick={() => setShowProfileMenu(false)} />
              <div className="profile-dropdown">
                <div className="profile-header">
                  <div className="profile-avatar">{userName.charAt(0)}</div>
                  <div className="profile-info">
                    <div className="profile-name">{userName}</div>
                    <div className="profile-role">{userRole}</div>
                  </div>
                </div>
                <div className="profile-divider" />
                <button className="profile-menu-item" onClick={handleViewProfile}>
                  <User size={18} />
                  <span>View Profile</span>
                </button>
                <button className="profile-menu-item logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
