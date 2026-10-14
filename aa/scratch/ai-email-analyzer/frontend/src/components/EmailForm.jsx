import React, { useState } from 'react';
import { Send, RotateCcw, Sparkles } from 'lucide-react';

const SAMPLE_EMAILS = [
  {
    title: 'Job Interview Confirmation',
    subject: 'Interview Confirmation',
    body: `Dear Priyanka,\n\nYour technical interview has been scheduled for Tuesday at 11 AM.\n\nPlease bring your updated resume.\n\nRegards,\nHR Team`,
  },
  {
    title: 'Project Sync Meeting',
    subject: 'Sprint Planning Meeting',
    body: `Hi Team,\n\nOur weekly sprint planning meeting is set for Friday at 3 PM via Zoom.\n\nPlease complete your task updates on Jira before the call.\n\nThanks,\nProject Manager`,
  },
  {
    title: 'Online Order Confirmation',
    subject: 'Order #84920 Shipped!',
    body: `Hello,\n\nYour Amazon purchase has been processed and shipped on 2026-09-22. Expected delivery date is Thursday.\n\nTracking link is available in your account.\n\nBest,\nCustomer Service`,
  },
];

/**
 * Email input form component
 */
const EmailForm = ({ onAnalyze, isLoading }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const MAX_CHARS = 10000;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    onAnalyze({ subject, body });
  };

  const handleClear = () => {
    setSubject('');
    setBody('');
  };

  const loadSample = (sample) => {
    setSubject(sample.subject);
    setBody(sample.body);
  };

  const charCount = body.length;
  const isNearLimit = charCount > MAX_CHARS * 0.9;

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ fontFamily: 'var(--font-family-heading)', fontSize: '1.25rem' }}>
          Paste Email Content
        </h2>
        
        {/* Sample preset buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', alignSelf: 'center', marginRight: '0.25rem' }}>Quick test:</span>
          {SAMPLE_EMAILS.map((sample, i) => (
            <button
              key={i}
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: '0.78rem', padding: '0.25rem 0.6rem' }}
              onClick={() => loadSample(sample)}
            >
              <Sparkles size={12} />
              {sample.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject" className="form-label">
            Email Subject <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(Optional)</span>
          </label>
          <input
            id="subject"
            type="text"
            className="form-input"
            placeholder="e.g. Technical Interview Confirmation"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <div className="form-label">
            <span>
              Email Body <span style={{ color: '#ef4444' }}>*</span>
            </span>
            <span className={`char-counter ${isNearLimit ? 'near-limit' : ''}`}>
              {charCount} / {MAX_CHARS} chars
            </span>
          </div>
          <textarea
            id="body"
            className="form-textarea"
            placeholder="Paste your email text here..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={MAX_CHARS}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
            disabled={isLoading || (!subject && !body)}
          >
            <RotateCcw size={16} />
            Clear
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !body.trim()}
          >
            <Send size={16} />
            {isLoading ? 'Analyzing...' : 'Analyze Email'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailForm;
