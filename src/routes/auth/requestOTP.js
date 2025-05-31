const express = require("express");
const router = express.Router();

const { z } = require("zod");
const bcrypt = require("bcrypt");
const { sendOTPEmail } = require("../../utils/emailSender.js");
const { setOTP } = require("../../utils/otpStore.js");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route handler
router.post("/", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    name: z.string().min(3),
    password: z.string().min(6),
    role: z.enum(["BUYER", "SELLER"]),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const { email, name, password, role } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const hashedOTP = await bcrypt.hash(otp, 4);

  setOTP(email, {
    hashedOTP,
    name,
    password,
    role,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
// console.log(email,otp)
  await sendOTPEmail(email, otp);

  return res.json({ message: "OTP sent to email" });
});

module.exports = router;


// const { z } = require("zod");
// const bcrypt = require("bcrypt");
// const { sendOTPEmail } = require("../../utils/emailSender.js");
// const { setOTP } = require("../../utils/otpStore.js");
// const express = require("express");
// const router = express.Router();

// router.post("/",async (req, res) => {
//   const schema = z.object({
//     email: z.string().email(),
//     name: z.string().min(3),
//     password: z.string().min(6),
//     role: z.enum(["BUYER", "SELLER"]),
//   });

//   const parsed = schema.safeParse(req.body);
//   if (!parsed.success) {
//     return res.status(400).json({ error: "Invalid input" });
//   }

//   const { email, name, password, role } = req.body;

//   // Check if user already exists
//   const existing = await prisma.user.findUnique({ where: { email } });
//   if (existing) {
//     return res.status(409).json({ error: "Email already registered" });
//   }

//   const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
//   const hashedOTP = await bcrypt.hash(otp, 4);

//   // Store OTP with user data temporarily
//   setOTP(email, {
//     hashedOTP,
//     name,
//     password,
//     role,
//     expiresAt: Date.now() + 5 * 60 * 1000,
//   });

//   await sendOTPEmail(email, otp);

//   return res.json({ message: "OTP sent to email" });
// });

// module.exports = router ;