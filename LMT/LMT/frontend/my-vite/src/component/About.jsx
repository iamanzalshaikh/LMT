import React from "react";
import aboutImg from "../assets/about.jpg";
import { CheckCircle } from "lucide-react"; // or any icon library

const About = () => {
  return (
    <section className="bg-white py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Side - Image */}
        <div className="flex justify-center">
          <img
            src={aboutImg}
            alt="About Us"
            className="rounded-2xl shadow-lg object-cover w-full max-w-md"
          />
        </div>

        {/* Right Side - Text */}
        <div>
          <p className="text-blue-600 font-medium mb-2">About Us</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            We Maximize Your Learning Growth
          </h2>
          <p className="text-gray-600 mb-6">
            We provide a modern Learning Management System to simplify online
            education, track progress, and enhance student-instructor
            collaboration efficiently.
          </p>

          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-blue-600" />
              Simplified Learning
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-blue-600" />
              Expert Trainers
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-blue-600" />
              Big Experience
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-blue-600" />
              Lifetime Access
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
