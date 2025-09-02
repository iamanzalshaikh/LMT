import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // you forgot to import toast

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    try {
      const res = await axios.post(`${serverUrl}/api/auth/sendotp`, { email });
      setMessage(res.data.message);
      toast.success(res.data.message);
      setStep(2);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error sending OTP";
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(`${serverUrl}/api/auth/verifyotp`, { email, otp });
      setMessage(res.data.message);
      toast.success(res.data.message);
      setStep(3);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Invalid OTP";
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(`${serverUrl}/api/auth/resetpassword`, {
        email,
        password: newPassword,
      });
      setMessage(res.data.message);
      toast.success(res.data.message);
      navigate("/login"); // redirect to login page
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error resetting password";
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {message && <p className="text-center text-sm text-red-600 mb-3">{message}</p>}

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <h1 className="text-xl font-bold mb-4 text-center">Forgot Your Password?</h1>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <>
            <h1 className="text-xl font-bold mb-4 text-center">Enter OTP</h1>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <>
            <h1 className="text-xl font-bold mb-4 text-center">Reset Your Password</h1>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full border px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full border px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
