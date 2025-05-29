const bcrypt = require("bcrypt");
const { getOTP, deleteOTP } = require("../../utils/otpStore.js");
const { generateToken } = require("../../utils/jwt.js");

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

    if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const stored = getOTP(email);
  if (!stored || !stored.hashedOTP) {
    return res.status(400).json({ error: "OTP not found or expired" });
  }

  const isValid = await bcrypt.compare(otp, stored.hashedOTP);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid OTP" });
  }

 let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {

  const hashedPassword = await bcrypt.hash(stored.password, 10);
  const user = await prisma.user.create({
    data: {
      name: stored.name,
      email,
      password: hashedPassword,
      role: stored.role,
    },
  });
  }

  deleteOTP(email); // Clean up OTP

  const token = generateToken(user);
  res.status(201).json({ token });
};

module.exports = { verifyOTP };
