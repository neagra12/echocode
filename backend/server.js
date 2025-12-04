const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'EchoCode backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Import routes (we'll create these next)
// const geminiRoutes = require('./routes/gemini');
// const sessionRoutes = require('./routes/session');

// Use routes
// app.use('/api/gemini', geminiRoutes);
// app.use('/api/session', sessionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 EchoCode backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});