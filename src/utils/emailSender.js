const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

 const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});
// console.log( process.env.EMAIL, process.env.PASS)
 const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail,transporter };