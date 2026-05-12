import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import CustomerLogin from './components/CustomerLogin';
import AdminLogin from './components/AdminLogin';
import FileUpload from './components/FileUpload';
import AdminDashboard from './components/AdminDashboard';
import QRLogin from './components/QRLogin';
import CustomerQRLogin from './components/CustomerQRLogin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ 
          padding: '1rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '700', fontSize: '1.25rem' }}>
              📁 FileHub
            </Link>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/" style={{ color: '#4299e1', textDecoration: 'none', fontWeight: '600', padding: '0.5rem 0.75rem', borderRadius: '8px', transition: 'all 0.3s ease' }}>
                Home
              </Link>
              <Link to="/qr-login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: '600', padding: '0.5rem 0.75rem', borderRadius: '8px', transition: 'all 0.3s ease' }}>
                📱 QR
              </Link>
              <Link to="/login" style={{ color: '#4299e1', textDecoration: 'none', fontWeight: '600', padding: '0.5rem 0.75rem', borderRadius: '8px', transition: 'all 0.3s ease' }}>
                Login
              </Link>
              <Link to="/upload" style={{ color: '#4299e1', textDecoration: 'none', fontWeight: '600', padding: '0.5rem 0.75rem', borderRadius: '8px', transition: 'all 0.3s ease' }}>
                Upload
              </Link>
              <Link to="/admin-login" style={{ color: '#e53e3e', textDecoration: 'none', fontWeight: '600', padding: '0.5rem 0.75rem', borderRadius: '8px', transition: 'all 0.3s ease' }}>
                Admin
              </Link>
            </div>
          </div>
        </nav>
        <main style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/qr-login" element={<QRLogin />} />
            <Route path="/customer-qr" element={<CustomerQRLogin />} />
            <Route path="/login" element={<CustomerLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/upload" element={<FileUpload />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
