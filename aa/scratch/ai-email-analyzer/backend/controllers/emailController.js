const Email = require('../models/emailModel');
const { analyzeEmail } = require('../services/llmService');
const mongoose = require('mongoose');

// In-memory fallback store when MongoDB service is not connected
const memoryStore = [];

/**
 * Check if Mongoose connection is ready (1 = connected)
 */
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * @desc    Analyze email content using LLM service and save to MongoDB
 * @route   POST /api/email/analyze
 * @access  Public
 */
const analyzeEmailHandler = async (req, res, next) => {
  try {
    const { subject, body } = req.body;

    // Validation
    if (!body || typeof body !== 'string' || body.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Email body is required and cannot be empty',
      });
    }

    if (body.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Email body exceeds maximum allowed length of 10,000 characters',
      });
    }

    const cleanSubject = subject ? subject.trim() : 'No Subject';
    const cleanBody = body.trim();

    // Call LLM Service
    const analysis = await analyzeEmail(cleanSubject, cleanBody);

    const emailPayload = {
      subject: cleanSubject,
      body: cleanBody,
      ...analysis,
    };

    let result;

    if (isDbConnected()) {
      // Save in MongoDB database
      const newEmail = new Email(emailPayload);
      result = await newEmail.save();
    } else {
      // Save in memory store with mock ID
      result = {
        _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        ...emailPayload,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.unshift(result);
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error in analyzeEmailHandler:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to analyze email at this time. Please try again.',
    });
  }
};

/**
 * @desc    Get history of all saved email analyses
 * @route   GET /api/email/history
 * @access  Public
 */
const getHistoryHandler = async (req, res, next) => {
  try {
    let history = [];

    if (isDbConnected()) {
      history = await Email.find().sort({ createdAt: -1 });
    } else {
      history = memoryStore;
    }

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error('Error in getHistoryHandler:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve email history',
    });
  }
};

/**
 * @desc    Get single email analysis details by ID
 * @route   GET /api/email/:id
 * @access  Public
 */
const getAnalysisByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    let email = null;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      email = await Email.findById(id);
    } else {
      email = memoryStore.find((item) => String(item._id) === String(id));
    }

    if (!email) {
      return res.status(404).json({
        success: false,
        message: `Email analysis with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: email,
    });
  } catch (error) {
    console.error('Error in getAnalysisByIdHandler:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve email analysis details',
    });
  }
};

/**
 * @desc    Delete single email analysis by ID
 * @route   DELETE /api/email/:id
 * @access  Public
 */
const deleteAnalysisHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deleted = false;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const result = await Email.findByIdAndDelete(id);
      if (result) deleted = true;
    } else {
      const index = memoryStore.findIndex((item) => String(item._id) === String(id));
      if (index !== -1) {
        memoryStore.splice(index, 1);
        deleted = true;
      }
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Email analysis with ID ${id} not found`,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email analysis deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteAnalysisHandler:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete email analysis',
    });
  }
};

module.exports = {
  analyzeEmail: analyzeEmailHandler,
  getHistory: getHistoryHandler,
  getAnalysisById: getAnalysisByIdHandler,
  deleteAnalysis: deleteAnalysisHandler,
};
