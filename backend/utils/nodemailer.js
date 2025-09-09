import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

// helper: Configure Nodemailer transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});