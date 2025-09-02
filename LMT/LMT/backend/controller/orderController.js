import express from 'express';
import dotenv from "dotenv";
import Course from "../model/CoursesModel.js";
import User from "../model/userModel.js";
import Razorpay from "razorpay";

dotenv.config();


// ✅ Initialize Razorpay
const RazorPayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ✅ Debug: Check if environment variables are loaded
console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Key Secret:", process.env.RAZORPAY_KEY_SECRET ? "✅ Loaded" : "❌ Missing");

export const RazorPayOrder = async (req, res) => {
    try {
        console.log("📝 Creating Razorpay order for:", req.body);
        
        const { courseId } = req.body;

        if (!courseId) {
            console.log("❌ Course ID missing");
            return res.status(400).json({ message: "Course ID is required" });
        }

        // ✅ Find course
        const course = await Course.findById(courseId);
        if (!course) {
            console.log("❌ Course not found:", courseId);
            return res.status(404).json({ message: "Course not found" });
        }

        console.log("✅ Course found:", course.title, "Price:", course.price);

        if (!course.price || isNaN(course.price)) {
            console.log("❌ Invalid price:", course.price);
            return res.status(400).json({ message: "Invalid course price" });
        }

        // ✅ Create Razorpay order

        const shortReceipt = `rcpt_${Date.now().toString().slice(-8)}`;
        const options = {
            amount: Math.round(course.price * 100), // Convert to paise and round
            currency: "INR",
            receipt: shortReceipt,
             notes: {
                courseId: courseId,
                courseName: course.title
            }
        };

        console.log("📦 Creating order with options:", options);

        const order = await RazorPayInstance.orders.create(options);
        
        console.log("✅ Order created successfully:", order.id);
        
        return res.status(200).json({
            success: true,
            ...order
        });

    } catch (error) {
        console.error("❌ Razorpay Order Error:", error);
        return res.status(500).json({ 
            success: false,
            message: `Failed to create RazorPay order: ${error.message}`,
            error: error.message 
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        console.log("🔍 Verifying payment:", req.body);
        
        const { userId, courseId, razorpay_order_id } = req.body;

        if (!userId || !courseId || !razorpay_order_id) {
            return res.status(400).json({ 
                message: "Missing required fields: userId, courseId, razorpay_order_id" 
            });
        }

        // ✅ Fetch order from Razorpay
        const orderInfo = await RazorPayInstance.orders.fetch(razorpay_order_id);
        console.log("📋 Order info:", orderInfo.status);

        if (orderInfo.status === "paid") {
            // ✅ Update user enrollment
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (!user.enrolledCourse.includes(courseId)) {
                user.enrolledCourse.push(courseId);
                await user.save();
                console.log("✅ User enrolled successfully");
            }

            // ✅ Update course enrollment
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            if (!course.enrolledStudents.includes(userId)) {
                course.enrolledStudents.push(userId);
                await course.save();
                console.log("✅ Course enrollment updated");
            }

            return res.status(200).json({ 
                success: true,
                message: "Payment verified and enrollment successful" 
            });
        } else {
            console.log("❌ Payment not completed, status:", orderInfo.status);
            return res.status(400).json({ 
                success: false,
                message: "Payment verification failed - payment not completed" 
            });
        }

    } catch (error) {
        console.error("❌ Payment verification error:", error);
        return res.status(500).json({ 
            success: false,
            message: `Internal server error: ${error.message}` 
        });
    }
};