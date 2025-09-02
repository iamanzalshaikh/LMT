import bcrypt from "bcrypt";
import validator from "validator";
import User from "../model/userModel.js";

import genToken from '../config/token.js';
import sendMail  from "../config/sendMail.js";


export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user already exists
    let existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email" });
    }

    // validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Enter a stronger password (min 6 chars)" });
    }

    // hash password
    let hashPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      name,
      password: hashPassword,
      email,
      role,
    });

    // generate token
    let token = genToken(user._id);

    // set cookie
res.cookie("token", token, {
  httpOnly: true,
  sameSite: "strict",
  secure: true, // MUST be true on production (HTTPS)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});


    res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    let token = genToken(user._id);

    // set cookie
  res.cookie("token", token, {
  httpOnly: true,
  sameSite: "strict",
  secure: true, // MUST be true on production (HTTPS)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});


    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};

export const logout = async (req, res) => {
  try {
    await res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout error" });
  }
};





// 1. Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpire = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 mins
    user.isOtpVerified = false;

    await user.save();

    await sendMail(email, otp);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Verify OTP
export const verifyOTP  = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetOtp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpire = undefined;

    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;
    user.isOtpVerified = false;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const googleLogin = async (req, res) => {
    try {
        console.log("📥 Google Login API Hit");

        const { name, email, role } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            // Create user with dummy password
            user = await User.create({
                name,
                email,
                role,
                password: Math.random().toString(36).slice(-8),
            });
        }

        const token = genToken(user._id);
        console.log("🔐 Token Generated:", token);

      res.cookie("token", token, {
  httpOnly: true,
  sameSite: "strict",
  secure: true, // MUST be true on production (HTTPS)
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});


        // ✅ Return role and other useful fields for frontend
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                photoUrl: user.photoUrl || "",
                enrolledCourse: user.enrolledCourse || [],
                isOtpVerified: user.isOtpVerified || false,
            },
        });
    } catch (error) {
        console.error("❌ Google Login Error (FULL):", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
