import type { Request, Response } from "express";
import { getCollection } from "../models/dbModel.js";
import { sendForgotPasswordOtp, sendOtpMail } from "../utils/mailers.js";

const userDatabse = getCollection(process?.env?.["USER_COLLECTION"] || "");
const otpStore = new Map();
const forgotPasswordOtpStore = new Map();

const sendRegisterOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await userDatabse.findOne({
    email,
  });

  if (user) {
    let error = new Error();
    //error.status = 400;
    error.cause = "email";
    error.message = "User email already exists";
    throw error;
  }

  let otp = Math.floor(1000 + Math.random() * 9000);
  const isMailSent = await sendOtpMail(email, otp);
  if (!isMailSent) {
    let error = new Error();
    //error.status = 500;
    error.message = "OTP not sent";
    throw error;
  }
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });
  return res.status(200).json({ success: true, message: "OTP sent" });
};

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

const forgotPasswordOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await userDatabse.findOne({
    email,
  });

  if (!user) {
    let error = new Error();
    //error.status = 400;
    error.cause = "email";
    error.message = "invalid email";
    throw error;
  }

  let otp = Math.floor(1000 + Math.random() * 9000);
  const isMailSent = await sendForgotPasswordOtp(email, otp);
  if (!isMailSent) {
    let error = new Error();
    //error.status = 500;
    error.message = "OTP not sent";
    throw error;
  }
  forgotPasswordOtpStore.set(email, {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  });
  return res.status(200).json({ success: true, message: "OTP sent" });
};

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
