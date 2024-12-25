import { createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});

type Method = "reset" | "verify"; 
interface EmailParams {
  email: string;
  otp: string;
  method: Method;
}

const sendEmail = async (email:string, otp:Number, method:string ) => {
  let subject: string;
  let textContent: string;
  let htmlContent: string;

  if (method === "reset") {
    subject = "Password Recovery OTP";
    textContent = `Hello,

We received a request to reset your password for Task Manager. Please use the following OTP to complete the process:

${otp}

If you did not request this, please ignore this email.

Best regards,
The Task Manager Team`;

    htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0056b3;">Password Recovery OTP</h2>
        <p>We received a request to reset your password for <strong>Task Manager</strong>. Please use the following OTP to complete the process:</p>
        <p style="font-size: 24px; font-weight: bold; color: #0056b3;">${otp}</p>
        <p>If you did not request this, please ignore this email.</p>
        <br>
        <p>Best regards,<br><strong>The Task Manager Team</strong></p>
      </div>
    `;
  } else {
    subject = "Verify Your Email Address";
    textContent = `Hello,

Thank you for registering with Task Manager. Please use the following OTP to verify your email address:

${otp}

If you did not request this, please ignore this email.

Best regards,
The Task Manager Team`;

    htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #0056b3;">Verify Your Email Address</h2>
        <p>Thank you for registering with <strong>Task Manager</strong>. Please use the following OTP to verify your email address:</p>
        <p style="font-size: 24px; font-weight: bold; color: #0056b3;">${otp}</p>
        <p>If you did not request this, please ignore this email.</p>
        <br>
        <p>Best regards,<br><strong>The Task Manager Team</strong></p>
      </div>
    `;
  }

  const mailOptions = {
    from: `"Task Manager Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    text: textContent,
    html: htmlContent,
  };

  try {
    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

export default sendEmail;
