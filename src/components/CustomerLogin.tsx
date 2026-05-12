import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import './CustomerLogin.css';

const CustomerLogin: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      alert('Please enter both name and email');
      return;
    }

    setIsLoading(true);
    
    try {
      // Register/login customer
      const customer = await ApiService.getInstance().registerCustomer(name.trim(), email.trim());
      
      // Set as current customer
      ApiService.getInstance().setCurrentCustomer(customer);

      // Navigate to upload page
      navigate('/upload');
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Login failed: ${errorMessage}. Please check your internet connection and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  return (
    <div className="customer-login">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome to FileHub</h1>
          <p>Sign in to upload your files or access admin dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In & Upload Files'}
          </button>
        </form>

        <div className="login-footer">
          <p>Are you an administrator?</p>
          <button 
            type="button"
            className="admin-btn"
            onClick={handleAdminAccess}
          >
            Access Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
