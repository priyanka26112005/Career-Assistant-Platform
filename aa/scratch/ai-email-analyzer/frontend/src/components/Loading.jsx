import React from 'react';

/**
 * Loading state component with spinner and progress message
 */
const Loading = ({ message = 'AI is reading your email and extracting insights...' }) => {
  return (
    <div className="loading-container card">
      <div className="spinner"></div>
      <h3 style={{ fontFamily: 'var(--font-family-heading)', color: '#ffffff' }}>Analyzing Email...</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
};

export default Loading;
