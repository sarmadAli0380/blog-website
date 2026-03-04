const mongoose = require('mongoose');

// Use environment variable for MongoDB URI, fallback to localhost for local dev
const mongoURL = process.env.MONGO_URI || 'mongodb://localhost:27017/BlogApp';

// establish the db connection
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log(`MongoDB connected: ${mongoURL}`);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

module.exports = db;
