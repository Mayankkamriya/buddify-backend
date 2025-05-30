require('dotenv').config();
const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const PORT = process.env.PORT || 5000;

// Debug: Verify the database URL is loaded
console.log('Database URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to the database.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();


// // src/server.js
// const app = require('./app');
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
