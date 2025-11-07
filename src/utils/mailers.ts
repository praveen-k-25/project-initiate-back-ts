const { transporter } = require("../configs/mailConfig");

const sendOtpMail = async (email, otp) => {
  try {
    const response = await transporter.mailer.sendMail({
      from: `<${process.env.EMAIL_USER}>`,
      to: email,
      subject: "OTP Verification Code",
      html: ` <div style="font-family:Arial,sans-serif; line-height:1.5; color:#333;">
                <h2 style="color:#2e6c80;">OTP Verification</h2>
                <p>Your One-Time Password is:</p>
                <h1 style="color:#2e6c80; letter-spacing:2px;">${otp}</h1>               
                <p style="font-size:13px; color:#777; margin-top:10px;">
                  <em>P.S. If you’re a recruiter or hiring manager exploring our system — 
                  I’m a passionate <strong>Full Stack Developer</strong> experienced in 
                  <strong>React, Node.js, and AI-powered web applications</strong>.  
                  I’d be glad to connect and discuss how I can contribute to your team.</em>
                </p>
                <p style="font-size:12px; color:#aaa; margin-top:8px;">
                  — <strong>Praveen K.</strong> | <a href="mailto:praveenkprofession@gmail.com" style="color:#2e6c80; text-decoration:none;">Contact Me</a>
                </p>
                <hr style="margin:20px 0; border:none; border-top:1px solid #ddd;">
                <p>This OTP will expire in 5 minutes.</p>
              </div>
            `,
    });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};

const sendForgotPasswordOtp = async (email, otp) => {
  try {
    await transporter.mailer.sendMail({
      from: `<${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Password Reset OTP`,
      html: ` <div style="font-family:Arial,sans-serif; line-height:1.5; color:#333;">
                <h2 style="color:#2e6c80;">OTP Verification</h2>
                <p>Your One-Time Password is:</p>
                <h1 style="color:#2e6c80; letter-spacing:2px;">${otp}</h1>               
                <p style="font-size:13px; color:#777; margin-top:10px;">
                  <em>P.S. If you’re a recruiter or hiring manager exploring our system — 
                  I’m a passionate <strong>Full Stack Developer</strong> experienced in 
                  <strong>React, Node.js, and AI-powered web applications</strong>.  
                  I’d be glad to connect and discuss how I can contribute to your team.</em>
                </p>
                <p style="font-size:12px; color:#aaa; margin-top:8px;">
                  — <strong>Praveen K.</strong> | <a href="mailto:praveenkprofession@gmail.com" style="color:#2e6c80; text-decoration:none;">Contact Me</a>
                </p>`,
    });
  } catch (err) {
    console.log(err);
    return false;
  }
  return true;
};

module.exports = { sendOtpMail, sendForgotPasswordOtp };
