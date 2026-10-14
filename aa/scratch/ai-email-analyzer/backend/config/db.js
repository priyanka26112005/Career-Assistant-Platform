const mongoose = require('mongoose');

/**
 * Connects to MongoDB database using connection string from environment variables.
 */
const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/email_analyzer';
    const conn = await mongoose.connect(connStr);
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Note: If MongoDB is not running locally, history features will use fallback memory storage or fail gracefully. Ensure MongoDB service is active or set MONGO_URI in backend/.env.');
  }
};

module.exports = connectDB;
