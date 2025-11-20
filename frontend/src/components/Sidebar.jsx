import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Users, X } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, userRole = 'admin' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = {
    committee: [
      { path: '/calendar', label: 'Event Calendar', icon: Calendar }
    ],
    teacher: [
      { path: '/calendar', label: 'Event Calendar', icon: Calendar }
    ],
    admin: [
      { path: '/calendar', label: 'Event Calendar', icon: Calendar },
      { path: '/admin/manage-users', label: 'Manage Users', icon: Users }
    ]
  };

  const currentMenuItems = menuItems[userRole.toLowerCase()] || menuItems.committee;

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Menu</h2>
          <button className="sidebar-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {currentMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigate(item.path)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
