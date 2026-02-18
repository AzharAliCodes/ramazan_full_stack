require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const { createUsersTable } = require('./src/models/userModel');
const authRoutes = require('./src/routes/userRoutes');
const { notFound, errorHandler } = require('./src/middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Error handling middlewares (must be after routes)
app.use(notFound);
app.use(errorHandler);

// Connect to database, create tables, and start server
connectDB().then(async () => {
  await createUsersTable();
  console.log('📋 Users table ready');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});
