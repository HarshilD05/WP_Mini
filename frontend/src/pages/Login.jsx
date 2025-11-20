import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, CheckCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { login } from '../apis/authAPI';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await login(formData);
      // Store user data in session storage
      sessionStorage.setItem('userId', response.userId);
      sessionStorage.setItem('userRole', response.role);
      sessionStorage.setItem('userName', response.name);
      
      // Redirect to home which will redirect based on role
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Branding Side */}
        <div className="brand-section">
          <div className="circle-deco-1"></div>
          <div className="circle-deco-2"></div>
          
          <div className="brand-header">
            <div className="logo-icon">
              <CheckCircle size={32} />
            </div>
            <h1 className="brand-title">ApproveFlow</h1>
          </div>

          <div className="hero-text" style={{position: 'relative', zIndex: 10}}>
            <h2>Welcome Back!</h2>
            <p>The Smart Permission & Event Approval Portal designed to streamline institutional workflows.</p>
          </div>
          
          <div style={{marginTop: 'auto', paddingTop: '3rem', position: 'relative', zIndex: 10}}>
             <small style={{color: '#DBEAFE'}}>Powered by Institutional IT Cell</small>
          </div>
        </div>

        {/* Form Side */}
        <div className="form-section">
          <div className="form-header">
            <h3>Sign In</h3>
            <p>Access your dashboard to manage permissions.</p>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="input-group">
                <label>Institutional Email</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input 
                    type="email" 
                    className="form-input"
                    placeholder="id@institution.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF'}}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
                <a href="#" style={{color: '#1976D2', fontSize: '0.875rem', textDecoration: 'none'}}>Forgot Password?</a>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Logging in...' : (
                  <>
                    Login to Dashboard <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="toggle-text">
              Don't have an account yet?{' '}
              <Link to="/signup" className="toggle-link">
                Sign Up
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
