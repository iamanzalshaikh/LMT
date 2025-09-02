import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "educator"],
      required: true,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    enrolledCourse: [
      {
        type: mongoose.Schema.Types.ObjectId,  // ✅ define type
        ref: "Course",                          // ✅ reference Course model
      },
    ],
    resetOtp: {
      type: String, // ✅ fixed
    },
    otpExpire: {
      type: Date,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
