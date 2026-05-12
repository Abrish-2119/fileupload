import React from 'react';

const TestSimple: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: 'white',
      color: 'black',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'red', fontSize: '3rem' }}>TEST PAGE - If you see this, React is working!</h1>
      <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>
        Current time: {new Date().toLocaleString()}
      </p>
      <div style={{ 
        padding: '1rem', 
        backgroundColor: 'lightblue', 
        borderRadius: '8px',
        margin: '1rem 0'
      }}>
        This is a test component to verify basic rendering is working.
      </div>
    </div>
  );
};

export default TestSimple;
