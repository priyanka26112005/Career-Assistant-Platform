const express = require('express');
const router = express.Router();
const {
  analyzeEmail,
  getHistory,
  getAnalysisById,
  deleteAnalysis,
} = require('../controllers/emailController');

// POST /api/email/analyze - Analyze email and return AI output
router.post('/analyze', analyzeEmail);

// GET /api/email/history - Retrieve all previously saved email analyses
router.get('/history', getHistory);

// GET /api/email/:id - Retrieve single email analysis by ID
router.get('/:id', getAnalysisById);

// DELETE /api/email/:id - Delete single email analysis by ID
router.delete('/:id', deleteAnalysis);

module.exports = router;
