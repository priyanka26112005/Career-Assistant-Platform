const mongoose = require('mongoose');

/**
 * Mongoose schema for storing analyzed email content and AI extraction results.
 */
const emailSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      default: 'No Subject',
      trim: true,
    },
    body: {
      type: String,
      required: [true, 'Email body is required'],
      trim: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
    summary: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Other',
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    action_items: {
      type: [String],
      default: [],
    },
    date: {
      type: String,
      default: '',
    },
    time: {
      type: String,
      default: '',
    },
    people: {
      type: [String],
      default: [],
    },
    organizations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt timestamps
  }
);

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
