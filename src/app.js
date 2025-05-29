// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// Sample health route
app.get('/', (req, res) => {
  res.send('Seller-Buyer API is running ✅');
});

// Routes will go here later

module.exports = app;
