import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      alert('Please enter admin password');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simple admin authentication (in real app, this would be server-side)
      if (password === 'admin123') {
        // Set admin session
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      } else {
        alert('Invalid admin password');
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <h1>🔐 Admin Access</h1>
          <p>Enter admin password to access dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Admin Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Access Admin Dashboard'}
          </button>
        </form>

        <div className="login-footer">
          <p>Not an administrator?</p>
          <button 
            type="button"
            className="home-btn"
            onClick={handleBackToHome}
          >
            Back to Home
          </button>
        </div>

        <div className="demo-note">
          <p><strong>Demo Password:</strong> admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
