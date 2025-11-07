const { getCollection } = require("../models/dbModel");
const { sendOtpMail, sendForgotPasswordOtp } = require("../utils/mailers");

const otpStore = new Map();
const forgotPasswordOtpStore = new Map();

const sendRegisterOtp = async (req, res) => {
  const { email } = req.body;
  const user = await getCollection(process.env.USER_COLLECTION).findOne({
    email,
  });

  if (user) {
    let error = new Error();
    error.status = 400;
    error.cause = "email";
    error.message = "User email already exists";
    throw error;
  }

  let otp = Math.floor(1000 + Math.random() * 9000);
  const isMailSent = await sendOtpMail(email, otp);
  if (!isMailSent) {
    let error = new Error();
    error.status = 500;
    error.message = "OTP not sent";
    throw error;
  }
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });
  return res.status(200).json({ success: true, message: "OTP sent" });
};

const verifyRegisterOtp = async (data) => {
  const { email, otp } = data;
  console.log("email : ", email, "OTP : ", otp);
  const storedOtp = otpStore.get(email);
  console.log(storedOtp, " OTP : ", otp);
  console.log("otpStore : ", otpStore);
  if (!storedOtp) {
    return false;
  }
  if (storedOtp.otp !== Number(otp)) {
    return false;
  }
  if (storedOtp.expires < Date.now()) {
    return false;
  }
  otpStore.delete(email);
  return true;
};

const forgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  const user = await getCollection(process.env.USER_COLLECTION).findOne({
    email,
  });
  console.log(user);

  if (!user) {
    let error = new Error();
    error.status = 400;
    error.cause = "email";
    error.message = "invalid email";
    throw error;
  }

  let otp = Math.floor(1000 + Math.random() * 9000);
  const isMailSent = await sendForgotPasswordOtp(email, otp);
  if (!isMailSent) {
    let error = new Error();
    error.status = 500;
    error.message = "OTP not sent";
    throw error;
  }
  forgotPasswordOtpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  });
  return res.status(200).json({ success: true, message: "OTP sent" });
};

const verifyForgotPasswordOtp = async (data) => {
  const { email, otp } = data;
  const storedOtp = forgotPasswordOtpStore.get(email);
  if (!storedOtp) {
    return false;
  }
  if (storedOtp.otp !== Number(otp)) {
    return false;
  }
  if (storedOtp.expires < Date.now()) {
    return false;
  }
  forgotPasswordOtpStore.delete(email);
  return true;
};

module.exports = {
  sendRegisterOtp,
  verifyRegisterOtp,
  forgotPasswordOtp,
  verifyForgotPasswordOtp,
};
