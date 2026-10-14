import axios from 'axios';

// Base API URL config
const API_URL = '/api/email';

/**
 * Service module responsible for communicating with Express Backend API endpoints.
 */
export const emailService = {
  /**
   * Send email subject and body to backend for AI analysis and storage.
   * @param {Object} data - { subject: string, body: string }
   * @returns {Promise<Object>} Analyzed email record
   */
  analyzeEmail: async ({ subject, body }) => {
    const response = await axios.post(`${API_URL}/analyze`, { subject, body });
    return response.data;
  },

  /**
   * Retrieve list of all previously analyzed emails.
   * @returns {Promise<Array>} List of email analysis records
   */
  getEmailHistory: async () => {
    const response = await axios.get(`${API_URL}/history`);
    return response.data;
  },

  /**
   * Fetch single email analysis record by ID.
   * @param {string} id - Analysis document ID
   * @returns {Promise<Object>} Email analysis record details
   */
  getEmailById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  /**
   * Delete single email analysis record by ID.
   * @param {string} id - Analysis document ID
   * @returns {Promise<Object>} Success status message
   */
  deleteEmail: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default emailService;
