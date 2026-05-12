import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { QRGenerator } from '../utils/QRGenerator';
import './CustomerQRLogin.css';

const CustomerQRLogin: React.FC = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(QRGenerator.generateCurrentPageURL());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName && customerEmail) {
      // Store customer info in localStorage for demo purposes
      const customer = {
        id: Math.random().toString(36).substring(7),
        name: customerName,
        email: customerEmail
      };
      localStorage.setItem('currentCustomer', JSON.stringify(customer));
      navigate('/upload');
    }
  };

  const handleQRScan = () => {
    // Simulate QR code scan - in real app, this would be handled by camera
    const customer = {
      id: Math.random().toString(36).substring(7),
      name: 'QR Customer',
      email: 'qr@example.com'
    };
    localStorage.setItem('currentCustomer', JSON.stringify(customer));
    navigate('/upload');
  };

  const handleDownloadQR = () => {
    QRGenerator.downloadQRCode('customer-qr-code', 'customer-access-qr.png');
  };

  return (
    <div className="customer-qr-login">
      <div className="qr-container">
        <div className="qr-header">
          <h1>📱 Customer Access</h1>
          <p>Choose your preferred login method</p>
        </div>

        <div className="qr-content">
          <div className="login-methods">
            <div className="method-card">
              <h3>🔤 Traditional Login</h3>
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button type="submit" className="submit-btn">
                  🚀 Start Uploading
                </button>
              </form>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="method-card">
              <h3>📸 Quick QR Access</h3>
              <div className="qr-method">
                <div className="qr-code-section">
                  <div className="qr-code-wrapper">
                    <QRCode
                      id="customer-qr-code"
                      value={currentUrl}
                      size={200}
                      level="H"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                  <p className="qr-instruction">
                    Scan this QR code with your phone camera
                  </p>
                </div>
                
                <div className="qr-actions">
                  <button 
                    className="qr-action-btn primary"
                    onClick={handleQRScan}
                  >
                    📱 Simulate QR Scan
                  </button>
                  <button 
                    className="qr-action-btn secondary"
                    onClick={handleDownloadQR}
                  >
                    📥 Download QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="features">
            <h3>✨ Why Use QR Code?</h3>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Instant access - no typing required</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <span>Mobile-friendly experience</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔐</span>
                <span>Secure direct connection</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <span>Fast file upload process</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerQRLogin;
