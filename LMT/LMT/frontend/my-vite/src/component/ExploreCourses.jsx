// C:\Users\ANZAL\Desktop\LMT\LMT\frontend\my-vite\src\component\ExploreCourses.jsx
import React from "react";
import {
  FaCode,
  FaPaintBrush,
  FaMobileAlt,
  FaUserSecret,
  FaRobot,
  FaChartLine,
  FaChartBar,
  FaTools,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ExploreCourses = () => {
  const courses = [
    { id: 1, title: "Web Development", icon: <FaCode />, color: "bg-pink-100" },
    { id: 2, title: "UI UX Designing", icon: <FaPaintBrush />, color: "bg-green-100" },
    { id: 3, title: "App Development", icon: <FaMobileAlt />, color: "bg-pink-100" },
    { id: 4, title: "Ethical Hacking", icon: <FaUserSecret />, color: "bg-purple-100" },
    { id: 5, title: "AI / ML", icon: <FaRobot />, color: "bg-green-100" },
    { id: 6, title: "Data Science", icon: <FaChartLine />, color: "bg-pink-100" },
    { id: 7, title: "Data Analytics", icon: <FaChartBar />, color: "bg-purple-100" },
    { id: 8, title: "AI Tools", icon: <FaTools />, color: "bg-green-100" },
  ];
  const navigate = useNavigate()

  return (
    <section className="px-6 md:px-16 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Explore Text */}
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Explore <br /> Our Courses
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. 
            Rem vel iure explicabo laboriosam accusantium expedita 
            laudantium facere magnam.
          </p>
          <button className="mt-8 px-8 py-3 text-lg font-semibold bg-black text-white rounded-xl shadow hover:bg-gray-800 transition" onClick={()=>navigate("/allcourses")}>
            Explore Courses →
          </button>
        </div>

        {/* Right Side - Courses Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-md cursor-pointer hover:scale-105 transition ${course.color}`}
            >
              <div className="text-4xl text-gray-700">{course.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800">{course.title}</h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ExploreCourses;
