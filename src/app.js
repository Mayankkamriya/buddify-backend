// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Sample health route
app.get('/', (req, res) => {
  res.send('Seller-Buyer API is running ✅');
});

// Routes will go here later

module.exports = app;
