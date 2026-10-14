import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnalyzeEmail from './pages/AnalyzeEmail';
import History from './pages/History';
import EmailDetails from './pages/EmailDetails';

/**
 * Root App Component with React Router structure
 */
function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<AnalyzeEmail />} />
            <Route path="/analyze" element={<Navigate to="/" replace />} />
            <Route path="/history" element={<History />} />
            <Route path="/history/:id" element={<EmailDetails />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer
          style={{
            borderTop: '1px solid var(--border-color)',
            padding: '1.5rem',
            textAlign: 'center',
            color: 'var(--text-dim)',
            fontSize: '0.85rem',
            background: 'var(--bg-main)',
          }}
        >
          AI-Powered Email Analyzer & Keyword Generator • Built with MERN & LLM Generative AI
        </footer>
      </div>
    </Router>
  );
}

export default App;
