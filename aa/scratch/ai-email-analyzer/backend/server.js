const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const emailRoutes = require('./routes/emailRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming request body as JSON
app.use(express.json());

// API Root Status Route
app.get('/', (req, res) => {
  res.json({
    message: '🚀 AI-Powered Email Analyzer & Keyword Generator API is running',
    version: '1.0.0',
    endpoints: {
      analyze: 'POST /api/email/analyze',
      history: 'GET /api/email/history',
      getSingle: 'GET /api/email/:id',
      deleteSingle: 'DELETE /api/email/:id',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Email API Routes
app.use('/api/email', emailRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`==================================================`);
});
