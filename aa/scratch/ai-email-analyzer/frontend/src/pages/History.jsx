import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import emailService from '../services/emailService';
import Loading from '../components/Loading';
import { Trash2, Eye, Search, AlertCircle, Inbox } from 'lucide-react';

/**
 * History page showing list of past email analyses
 */
const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await emailService.getEmailHistory();
      if (res && res.success) {
        setHistory(res.data || []);
      } else {
        setError(res?.message || 'Failed to fetch email history');
      }
    } catch (err) {
      console.error('History fetch error:', err);
      setError('Unable to load email history. Please check if backend server is connected.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this analysis from history?')) return;

    try {
      const res = await emailService.deleteEmail(id);
      if (res && res.success) {
        setHistory((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      alert('Failed to delete email analysis.');
    }
  };

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    const subjectMatch = (item.subject || '').toLowerCase().includes(term);
    const categoryMatch = (item.category || '').toLowerCase().includes(term);
    const summaryMatch = (item.summary || '').toLowerCase().includes(term);
    return subjectMatch || categoryMatch || summaryMatch;
  });

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Analysis History</h1>
        <p className="page-subtitle">
          Browse and review all your previously analyzed emails and extracted action items.
        </p>
      </header>

      {error && (
        <div className="alert">
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Search Filter input */}
      {!loading && history.length > 0 && (
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-dim)',
            }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.75rem' }}
            placeholder="Search history by subject, category, or summary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {loading ? (
        <Loading message="Loading history records from backend..." />
      ) : filteredHistory.length === 0 ? (
        <div className="card empty-state">
          <Inbox className="empty-icon" />
          <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>
            {searchTerm ? 'No matching history found' : 'No Email History Yet'}
          </h3>
          <p>
            {searchTerm
              ? 'Try adjusting your search criteria.'
              : 'Paste and analyze an email on the main page to see your history here.'}
          </p>
          {!searchTerm && (
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
              Analyze First Email
            </Link>
          )}
        </div>
      ) : (
        <div className="history-grid">
          {filteredHistory.map((item) => {
            const formattedDate = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recently';

            return (
              <div key={item._id} className="history-card">
                <div className="history-info">
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-category">{item.category || 'Other'}</span>
                    <span
                      className={`badge badge-priority-${(item.priority || 'medium').toLowerCase()}`}
                    >
                      {item.priority} Priority
                    </span>
                  </div>

                  <h3 className="history-subject">{item.subject || 'No Subject'}</h3>
                  <p className="history-summary">{item.summary}</p>
                  
                  <div className="history-meta">
                    <span>Analyzed: {formattedDate}</span>
                    {item.keywords && item.keywords.length > 0 && (
                      <span>• {item.keywords.length} keywords extracted</span>
                    )}
                  </div>
                </div>

                <div className="history-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    to={`/history/${item._id}`}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
                  >
                    <Eye size={16} />
                    View
                  </Link>

                  <button
                    className="btn btn-danger"
                    style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
                    onClick={(e) => handleDelete(item._id, e)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
