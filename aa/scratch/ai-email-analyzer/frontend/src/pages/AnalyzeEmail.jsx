import React, { useState } from 'react';
import EmailForm from '../components/EmailForm';
import AnalysisResult from '../components/AnalysisResult';
import Loading from '../components/Loading';
import emailService from '../services/emailService';
import { AlertCircle, Sparkles } from 'lucide-react';

/**
 * Main Page component for submitting and analyzing email content
 */
const AnalyzeEmail = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async ({ subject, body }) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await emailService.analyzeEmail({ subject, body });

      if (response && response.success) {
        setAnalysisResult(response.data);
      } else {
        setError(response?.message || 'Failed to analyze email. Please try again.');
      }
    } catch (err) {
      console.error('Error analyzing email:', err);
      const msg = err.response?.data?.message || 'Unable to connect to the backend server. Please make sure backend is running.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">AI Email Content Analyzer</h1>
        <p className="page-subtitle">
          Instantly extract summary, category, priority, action items, keywords, and mentioned metadata from any email using Generative AI.
        </p>
      </header>

      {error && (
        <div className="alert">
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <EmailForm onAnalyze={handleAnalyze} isLoading={isLoading} />

      {isLoading && <Loading />}

      {!isLoading && analysisResult && <AnalysisResult data={analysisResult} />}
    </div>
  );
};

export default AnalyzeEmail;
