import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ✅ Create transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.USER_EMAIL,     
    pass: process.env.USER_PASSWORD,  
  },
});

// ✅ Send OTP Mail (expires in 5 mins)
const sendMail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.USER_EMAIL,
      to,
      subject: "Password Reset OTP (Valid for 5 Minutes)",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #000;">Password Reset Request</h2>
          <p>Your OTP for resetting your password is:</p>
          <h1 style="background: #000; color: #fff; padding: 10px 20px; display: inline-block; border-radius: 8px;">
            ${otp}
          </h1>
          <p style="margin-top: 20px; font-size: 14px; color: red;">
            ⚠️ This OTP will expire in <b>5 minutes</b>. Please do not share it with anyone.
          </p>
          <hr/>
          <p style="font-size: 12px; color: #555;">
            If you didn’t request a password reset, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log("✅ Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email: ", error);
    throw error;
  }
};

export default sendMail;
