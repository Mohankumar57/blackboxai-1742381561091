require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Import routes
const authRoutes = require('./routes/authRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teamRoutes = require('./routes/teamRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/assessment', assessmentRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
