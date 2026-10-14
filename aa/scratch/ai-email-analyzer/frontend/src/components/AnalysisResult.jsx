import React from 'react';
import KeywordList from './KeywordList';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Building2,
  FileText,
  ListChecks,
  Tag,
  AlertCircle
} from 'lucide-react';

/**
 * Render visual badge based on priority level
 */
const PriorityBadge = ({ priority = 'Medium' }) => {
  const pri = priority.toLowerCase();
  let className = 'badge badge-priority-medium';

  if (pri === 'high') className = 'badge badge-priority-high';
  if (pri === 'low') className = 'badge badge-priority-low';

  return <span className={className}>{priority} Priority</span>;
};

/**
 * Render Category badge
 */
const CategoryBadge = ({ category = 'Other' }) => {
  return <span className="badge badge-category">{category}</span>;
};

/**
 * Renders the structured analysis results in clean visual cards
 */
const AnalysisResult = ({ data }) => {
  if (!data) return null;

  const {
    subject,
    summary,
    category,
    priority,
    keywords = [],
    action_items = [],
    date,
    time,
    people = [],
    organizations = [],
  } = data;

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="result-header">
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
            Email Subject
          </span>
          <h3 className="result-title">{subject || 'No Subject Specified'}</h3>
        </div>

        <div className="badges-group">
          <CategoryBadge category={category} />
          <PriorityBadge priority={priority} />
        </div>
      </div>

      <div className="result-grid">
        {/* Summary Card */}
        <div className="result-box result-box-full">
          <div className="box-title">
            <FileText size={16} color="var(--primary)" />
            AI Executive Summary
          </div>
          <p style={{ fontSize: '1.05rem', color: '#f1f5f9', lineHeight: 1.6 }}>
            {summary || 'No summary generated.'}
          </p>
        </div>

        {/* Keywords Card */}
        <div className="result-box result-box-full">
          <div className="box-title">
            <Tag size={16} color="var(--accent-purple)" />
            Extracted Keywords
          </div>
          <KeywordList keywords={keywords} />
        </div>

        {/* Action Items */}
        <div className="result-box result-box-full">
          <div className="box-title">
            <ListChecks size={16} color="#10b981" />
            Action Items
          </div>
          {action_items && action_items.length > 0 ? (
            <ul className="action-items-list">
              {action_items.map((item, idx) => (
                <li key={idx} className="action-item">
                  <CheckCircle2 size={18} className="action-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>No action items required</span>
          )}
        </div>

        {/* Date */}
        <div className="result-box">
          <div className="box-title">
            <Calendar size={16} color="#3b82f6" />
            Date Mentioned
          </div>
          <span style={{ fontWeight: 600, color: date ? '#ffffff' : 'var(--text-dim)' }}>
            {date || 'None mentioned'}
          </span>
        </div>

        {/* Time */}
        <div className="result-box">
          <div className="box-title">
            <Clock size={16} color="#f59e0b" />
            Time Mentioned
          </div>
          <span style={{ fontWeight: 600, color: time ? '#ffffff' : 'var(--text-dim)' }}>
            {time || 'None mentioned'}
          </span>
        </div>

        {/* People */}
        <div className="result-box">
          <div className="box-title">
            <Users size={16} color="#ec4899" />
            People
          </div>
          {people && people.length > 0 ? (
            <span style={{ fontWeight: 500, color: '#ffffff' }}>{people.join(', ')}</span>
          ) : (
            <span style={{ color: 'var(--text-dim)' }}>None</span>
          )}
        </div>

        {/* Organizations */}
        <div className="result-box">
          <div className="box-title">
            <Building2 size={16} color="#8b5cf6" />
            Organizations
          </div>
          {organizations && organizations.length > 0 ? (
            <span style={{ fontWeight: 500, color: '#ffffff' }}>{organizations.join(', ')}</span>
          ) : (
            <span style={{ color: 'var(--text-dim)' }}>None</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
