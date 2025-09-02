import React, { useState } from 'react';
import logo from '../assets/logo.jpg';
import google from "../assets/google.jpg";
import { RxEyeOpen } from "react-icons/rx";
import { GoEyeClosed } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from "../App";
import { toast } from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { auth, provider } from "../../utils/firebase";
import { signInWithPopup } from 'firebase/auth';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRoleSelect = (selectedRole) => setRole(selectedRole);

    // Normal Login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(
                serverUrl + "/api/auth/login",
                { email, password, role },
                { withCredentials: true }
            );
            dispatch(setUserData(res.data.user));
            toast.success("Login successful");
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            if (error.response) toast.error(error.response.data.message || "Login failed");
            else if (error.request) toast.error("No response from server");
            else toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Google Login
    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const name = user.displayName;
            const email = user.email;

            const res = await axios.post(
                serverUrl + "/api/auth/googlelogin",
                { name, email, role },
                { withCredentials: true }
            );

            dispatch(setUserData(res.data.user));
            toast.success("Login successful");
            navigate("/");
        } catch (error) {
            console.error("Google login error:", error);
            toast.error(error.response?.data?.message || error.message || "Google login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#dddbdb] min-h-screen flex items-center justify-center p-4 overflow-hidden">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl rounded-2xl flex flex-col md:flex-row w-full max-w-7xl max-h-screen overflow-hidden"
            >
                {/* Left Side */}
                <div className="md:w-1/2 w-full flex flex-col justify-center p-6 overflow-y-auto max-h-screen">
                    <div className="mb-6">
                        <h1 className="font-semibold text-black text-3xl mb-2">Welcome Back</h1>
                        <h2 className="text-[#999797] text-lg">Login to your account</h2>
                    </div>

                    <div className="flex flex-col gap-4 max-w-md mx-auto md:mx-0">
                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label htmlFor="email" className="font-semibold">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Your Email"
                                className="w-full h-10 border border-[#e7e6e6] px-4 text-[15px] rounded focus:outline-none focus:ring-2 focus:ring-black"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="relative flex flex-col gap-1 w-full max-w-md">
                            <label htmlFor="password" className="font-semibold">Password</label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Your Password"
                                className="h-10 w-full pr-12 pl-4 rounded border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-black leading-[2.5rem]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black flex items-center justify-center"
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                style={{ width: 28, height: 28 }}
                            >
                                {showPassword ? <RxEyeOpen size={22} /> : <GoEyeClosed size={22} />}
                            </button>
                        </div>

                        {/* Role Selection */}
                        <div className="flex gap-4">
                            <span
                                onClick={() => handleRoleSelect("student")}
                                className={`flex-1 p-2 border rounded-xl cursor-pointer select-none text-center ${role === "student" ? "border-black font-semibold" : "border-[#e7e6e6] hover:border-black"}`}
                            >
                                Student
                            </span>
                            <span
                                onClick={() => handleRoleSelect("educator")}
                                className={`flex-1 p-2 border rounded-xl cursor-pointer select-none text-center ${role === "educator" ? "border-black font-semibold" : "border-[#e7e6e6] hover:border-black"}`}
                            >
                                Educator
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full h-10 bg-black text-white rounded flex items-center justify-center cursor-pointer text-base font-semibold"
                            disabled={loading}
                        >
                            {loading ? <ClipLoader color="#ffffff" size={20} /> : "Login"}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-2 mt-4">
                            <div className="flex-1 h-[1px] bg-[#c4c4c4]" />
                            <div className="text-[15px] text-[#6f6f6f] flex items-center justify-center whitespace-nowrap">or Continue</div>
                            <div className="flex-1 h-[1px] bg-[#c4c4c4]" />
                        </div>

                        {/* Google Login */}
                        <div
                            onClick={handleGoogleLogin}
                            className="w-full h-10 border border-black rounded flex items-center justify-center gap-2 mt-1 cursor-pointer hover:bg-gray-100 select-none"
                        >
                            <img src={google} alt="Google logo" className="w-6 h-6" />
                            <span className="text-[18px] text-gray-500">Google</span>
                        </div>

                        {/* Signup Link */}
                        <div className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate("/signup")}
                                className="text-black font-semibold hover:underline"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="md:w-1/2 hidden md:flex flex-col items-center justify-center rounded-r-2xl bg-black p-8 max-h-screen overflow-hidden">
                    <img src={logo} alt="Logo" className="w-32 shadow-2xl" />
                    <span className="text-2xl text-white mt-6">VIRTUAL COURSES</span>
                </div>
            </form>
        </div>
    );
};

export default Login;
