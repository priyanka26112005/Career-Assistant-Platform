import React from 'react';
import { Tag } from 'lucide-react';

/**
 * Renders a list of keyword tags
 */
const KeywordList = ({ keywords = [] }) => {
  if (!keywords || keywords.length === 0) {
    return <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>None extracted</span>;
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
      {keywords.map((kw, idx) => (
        <span key={idx} className="keyword-tag">
          <Tag size={12} style={{ marginRight: '0.35rem', opacity: 0.7 }} />
          {kw}
        </span>
      ))}
    </div>
  );
};

export default KeywordList;
