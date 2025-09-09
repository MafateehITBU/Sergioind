import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

// Create Nodemailer transporter with full debug logging
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: parseInt(process.env.SMTP_PORT, 10) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // should be Zoho app password
  },
  logger: true, // logs SMTP actions to console
  debug: true, // shows SMTP communication
});

// Verify SMTP connection once at app startup
transporter.verify((error, success) => {
  if (error) console.error("SMTP connection failed:", error);
  else console.log("SMTP server is ready to take messages:", success);
});
