import { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Shield, Key, Eye, EyeOff } from 'lucide-react';
import './UserProfile.css';

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        // Get user info from session storage
        const userId = sessionStorage.getItem('userId');
        const userName = sessionStorage.getItem('userName');
        const userRole = sessionStorage.getItem('userRole');
        
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/users/${userId}`);
        // const data = await response.json();
        
        // Mock data for development
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockData = {
          id: userId || 'USR-001',
          name: userName || 'John Doe',
          email: 'john.doe@college.edu',
          role: userRole || 'committee',
          committee: userRole === 'committee' ? 'Computer Science Society' : null,
          joinedDate: '2024-01-15',
          phone: '+91 9876543210'
        };
        
        setUserInfo(mockData);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    setPasswordError('');
    setPasswordSuccess(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/users/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: userInfo.id,
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // });

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (error) {
      setPasswordError('Failed to change password. Please try again.');
    }
  };

  const getRoleDisplay = (role) => {
    const roleMap = {
      committee: 'Committee Member',
      teacher: 'Faculty',
      admin: 'Administrator'
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="loading-state">Loading profile...</div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="user-profile-page">
        <div className="error-state">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <h1>User Profile</h1>
        <p>View and manage your account information</p>
      </div>

      {/* Profile Information Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          <User size={48} />
        </div>
        
        <div className="profile-details">
          <div className="detail-row">
            <div className="detail-icon">
              <User size={20} />
            </div>
            <div className="detail-content">
              <label>Full Name</label>
              <span>{userInfo.name}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon">
              <Mail size={20} />
            </div>
            <div className="detail-content">
              <label>Email Address</label>
              <span>{userInfo.email}</span>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-icon">
              <Shield size={20} />
            </div>
            <div className="detail-content">
              <label>Role</label>
              <span>{getRoleDisplay(userInfo.role)}</span>
            </div>
          </div>

          {userInfo.committee && (
            <div className="detail-row">
              <div className="detail-icon">
                <Briefcase size={20} />
              </div>
              <div className="detail-content">
                <label>Committee</label>
                <span>{userInfo.committee}</span>
              </div>
            </div>
          )}

          <div className="detail-row">
            <div className="detail-icon">
              <User size={20} />
            </div>
            <div className="detail-content">
              <label>User ID</label>
              <span>{userInfo.id}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="password-section">
        <div className="section-header">
          <div className="section-title">
            <Key size={20} />
            <h2>Security</h2>
          </div>
          {!showChangePassword && (
            <button 
              className="btn-change-password" 
              onClick={() => setShowChangePassword(true)}
            >
              Change Password
            </button>
          )}
        </div>

        {showChangePassword && (
          <form className="password-form" onSubmit={handlePasswordSubmit}>
            <div className="form-field">
              <label>Current Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {passwordError && (
              <div className="password-error">{passwordError}</div>
            )}

            {passwordSuccess && (
              <div className="password-success">Password changed successfully!</div>
            )}

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn-submit">
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
