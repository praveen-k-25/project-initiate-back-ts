import type { Request, Response } from "express";
import { sendForgotPasswordOtp, sendOtpMail } from "../utils/mailers.js";
import { getCollection } from "../database/collection.js";
import { AppError, asyncHandler } from "../middleware/ErrorHandler.js";

const otpStore = new Map();
const forgotPasswordOtpStore = new Map();

const sendRegisterOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await getCollection(process.env.USER_COLLECTION!).findOne({
    email,
  });

  if (user) throw new AppError("User email already exists", 400, "email");

  let otp = Math.floor(1000 + Math.random() * 9000);
  const isMailSent = await sendOtpMail(email, otp);
  if (!isMailSent) throw new AppError("OTP not sent", 500, "otp");

  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });
  return res.status(200).json({ success: true, message: "OTP sent" });
});

const verifyRegisterOtp = async (data: any) => {
  const { email, otp } = data;
  const storedOtp = otpStore.get(email);
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

const forgotPasswordOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await getCollection(process.env.USER_COLLECTION!).findOne({
    email,
  });

  if (!user) throw new AppError("invalid email", 400, "email");

  let otp = Math.floor(1000 + Math.random() * 9000);
  const isMailSent = await sendForgotPasswordOtp(email, otp);
  if (!isMailSent) throw new AppError("OTP not sent", 500, "otp");

  forgotPasswordOtpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  });
  return res.status(200).json({ success: true, message: "OTP sent" });
});

const verifyForgotPasswordOtp = async (data: any) => {
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

export {
  sendRegisterOtp,
  verifyRegisterOtp,
  forgotPasswordOtp,
  verifyForgotPasswordOtp,
};
