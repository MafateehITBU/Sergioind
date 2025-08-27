import { transporter } from "./nodemailer.js";

/**
 * Send applicant info to APPLICANTS_EMAIL with CV attachment
 * @param {Object} applicantData - Applicant info (including local CV path)
 */
export const sendApplicantEmail = async (applicantData) => {
  try {
    const senderLabel = "Sergio";
    const emailUser = process.env.EMAIL_USER;

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

    const mailOptions = {
      from: `"${senderLabel}" <${emailUser}>`,
      to: process.env.APPLICANTS_EMAIL,
      subject: `New Applicant for ${postTitle}`,
      text: `
        A new application has been received for "${postTitle}":

        Name: ${name}
        Email: ${email}
        Phone: ${phoneNumber}
        Speciality: ${speciality}
        Experience Years: ${experienceYears}
        Gender: ${gender}
        Address: ${address.street}, ${address.city}
      `,
      attachments: [
        {
          filename: cvOriginalName || "CV.pdf",
          path: cvPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

  } catch (err) {
    console.error("Error sending applicant email:", err);
    throw err;
  }
};
