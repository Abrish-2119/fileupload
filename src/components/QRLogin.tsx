import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { QRGenerator } from '../utils/QRGenerator';
import './QRLogin.css';

const QRLogin: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    setCurrentUrl(QRGenerator.generateCurrentPageURL());
  }, []);

  const handleDownloadQR = () => {
    QRGenerator.downloadQRCode('qr-code-svg', 'file-upload-qr.png');
  };

  return (
    <div className="qr-login-container">
      <div className="qr-header">
        <h2>📱 Quick Access QR Code</h2>
        <p>Scan this QR code to access the file upload system</p>
      </div>

      <div className="qr-content">
        <div className="qr-card">
          <div className="qr-code-wrapper">
            <QRCode
              id="qr-code-svg"
              value={currentUrl}
              size={256}
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          
          <div className="qr-info">
            <h3>Scan & Upload</h3>
            <ul>
              <li>📱 Open camera app</li>
              <li>🔍 Scan the QR code</li>
              <li>🌐 Visit the website</li>
              <li>📤 Start uploading files</li>
            </ul>
          </div>
        </div>

        <div className="qr-actions">
          <button 
            className="qr-btn primary"
            onClick={() => setShowQR(!showQR)}
          >
            {showQR ? 'Hide QR Code' : 'Show QR Code'}
          </button>
          
          <button 
            className="qr-btn secondary"
            onClick={handleDownloadQR}
          >
            📥 Download QR Code
          </button>
        </div>

        {showQR && (
          <div className="qr-large">
            <div className="qr-large-wrapper">
              <QRCode
                value={currentUrl}
                size={512}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            <p className="qr-url">{currentUrl}</p>
          </div>
        )}

        <div className="qr-features">
          <h3>✨ Features</h3>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <div>
                <h4>Fast Access</h4>
                <p>No typing required</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <div>
                <h4>Mobile Friendly</h4>
                <p>Works on all devices</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔐</span>
              <div>
                <h4>Secure</h4>
                <p>Direct connection</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📤</span>
              <div>
                <h4>Easy Upload</h4>
                <p>Drag & drop files</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRLogin;
