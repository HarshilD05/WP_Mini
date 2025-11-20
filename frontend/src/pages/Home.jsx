import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">College Event Permission System</h1>
        <p className="home-subtitle">Request and manage permissions for college events</p>
        
        <div className="home-actions">
          <button 
            className="primary-button"
            onClick={() => navigate('/request-form')}
          >
            Create New Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
