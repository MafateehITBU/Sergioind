import { transporter } from "./nodemailer.js";
import fs from "fs";

/**
 * Send applicant info to APPLICANTS_EMAIL with CV attachment
 * @param {Object} applicantData - Applicant info (including local CV path)
 */
export const sendApplicantEmail = async (applicantData) => {
  try {
    const senderLabel = "Sergio";
    const emailUser = process.env.EMAIL_USER;
    const recipientEmail = process.env.APPLICANTS_EMAIL;

    if (!recipientEmail) {
      throw new Error("Recipient email (APPLICANTS_EMAIL) is not set in .env");
    }

    const {
      name,
      email,
      phoneNumber,
      speciality,
      experienceYears,
      gender,
      address,
      postTitle,
      cvPath,
      cvOriginalName,
    } = applicantData;

    // Check attachment file
    const attachments = [];
    if (cvPath) {
      if (!fs.existsSync(cvPath)) {
        throw new Error(`Attachment file does not exist: ${cvPath}`);
      }
      attachments.push({
        filename: cvOriginalName || "CV.pdf",
        path: cvPath,
      });
    }

    // Build email
    const mailOptions = {
      from: `"${senderLabel}" <${emailUser}>`,
      to: recipientEmail,
      subject: `New Applicant for ${postTitle}`,
      text: `
            A new application has been received for "${postTitle}":

            Name: ${name}
            Email: ${email}
            Phone: ${phoneNumber}
            Speciality: ${speciality}
            Experience Years: ${experienceYears}
            Gender: ${gender}
            Address: ${address?.street || ""}, ${address?.city || ""}
        `,
      attachments,
    };

    console.log("Sending email to:", recipientEmail);
    console.log("Attachments:", attachments.length > 0 ? attachments : "None");

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (err) {
    console.error("Failed to send applicant email:", err.message);
    if (err.response) console.error("SMTP response:", err.response.toString());
    throw err;
  }
};
