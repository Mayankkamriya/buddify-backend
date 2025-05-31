const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const prisma = new PrismaClient();

const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation for required fields
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required: name, email, password, role' });
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: role === 'SELLER' ? 'SELLER' : 'BUYER'
      }
    });

    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation for required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email },
      include: { bids: true } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        projectsCreated: true,
        projectsTaken: true,
        bids: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      status: 'success',
      data: user
    });
  } catch (err) {
    console.error('Error in getUserDetails:', err);
    res.status(500).json({ 
      status: 'error',
      message: err.message 
    });
  }
};

module.exports = { signup, login,getUserDetails };
