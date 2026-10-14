import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import emailService from '../services/emailService';
import AnalysisResult from '../components/AnalysisResult';
import Loading from '../components/Loading';
import { ArrowLeft, Trash2, Mail, AlertCircle } from 'lucide-react';

/**
 * Page displaying full details of a specific saved email analysis record
 */
const EmailDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await emailService.getEmailById(id);
        if (res && res.success) {
          setData(res.data);
        } else {
          setError(res?.message || 'Analysis record not found');
        }
      } catch (err) {
        console.error('Fetch details error:', err);
        setError('Failed to fetch analysis details from server.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return;
    try {
      const res = await emailService.deleteEmail(id);
      if (res && res.success) {
        navigate('/history');
      }
    } catch (err) {
      alert('Failed to delete analysis record.');
    }
  };

  if (loading) return <Loading message="Loading analysis details..." />;

  if (error) {
    return (
      <div style={{ marginTop: '2rem' }}>
        <div className="alert">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
        <Link to="/history" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to History
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Top navigation actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/history" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to History
        </Link>

        <button className="btn btn-danger" onClick={handleDelete}>
          <Trash2 size={16} /> Delete Analysis
        </button>
      </div>

      {/* Raw Email Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="box-title" style={{ marginBottom: '0.75rem' }}>
          <Mail size={16} color="var(--primary)" />
          Original Email Content
        </div>
        <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.75rem' }}>
          Subject: {data.subject || 'No Subject'}
        </h3>
        <div
          style={{
            background: 'var(--bg-input)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            whiteSpace: 'pre-wrap',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-family-sans)',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {data.body}
        </div>
      </div>

      {/* Structured AI Analysis Output */}
      <AnalysisResult data={data} />
    </div>
  );
};

export default EmailDetails;
