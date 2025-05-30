// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const bidRoutes = require('./routes/bid.routes');
const deliverableRoutes = require('./routes/deliverable.routes');
const { PrismaClient } = require('@prisma/client');
const  requestOTP = require('./routes/auth/requestOTP');
const { verifyOTP } = require('./routes/auth/verifyOTP');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/requestotp', requestOTP);
app.use('/api/verifyotp', verifyOTP);

app.use('/api/projects', projectRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/deliverables', deliverableRoutes);

// Sample health route
app.get('/', (req, res) => {
  res.send('Seller-Buyer Bid API is running ✅');
});

// Routes will go here later

module.exports = app;
