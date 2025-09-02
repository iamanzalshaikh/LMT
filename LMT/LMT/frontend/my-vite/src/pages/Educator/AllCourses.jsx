
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Card from "../../component/Card";
import Nav from "../../component/Nav";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import SearchAi from "../../assets/SearchAi.png";

const AllCourses = () => {
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const mainCategories = [
    "AI/ML",
    "Data Analytics",
    "Ethical Hacking",
    "UI UX Designing",
    "Web Development",
  ];

  const categories = ["All", ...mainCategories, "Others"];

  useEffect(() => {
    if (Array.isArray(courseData)) {
      let courses = [...courseData];

      // Search filter
      if (searchTerm.trim() !== "") {
        courses = courses.filter((course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Category filter
      if (selectedCategory === "Others") {
        courses = courses.filter(
          (course) => !mainCategories.includes(course.category)
        );
      } else if (selectedCategory !== "All") {
        courses = courses.filter(
          (course) => course.category === selectedCategory
        );
      }

      setFilteredCourses(courses);
    }
  }, [searchTerm, selectedCategory, courseData]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Navbar */}
      <Nav />

      {/* Sidebar */}
      <aside className="w-[260px] h-screen bg-black text-white fixed top-16 left-0 p-6 shadow-md flex flex-col justify-between">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col h-full justify-between"
        >
          <div>
            {/* Search With AI Input at Top */}
            <div className="flex items-center bg-gray-700 px-3 py-2 rounded-lg mb-4">
             <input
  type="text"
  placeholder="Search With AI"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="bg-transparent outline-none text-white w-full placeholder-gray-300 cursor-pointer"
  onClick={() => navigate("/search")}
/>

              <button
                type="submit"
                className="flex items-center justify-center ml-2"
              >
                <img
                  src={SearchAi}
                  alt="Search AI"
                  className="w-6 h-6 rounded-full"
                />
              </button>
            </div>

            {/* Arrow icon + Filter Title */}
            <div className="flex items-center gap-2 mb-6">
              <FaArrowLeftLong
                className="cursor-pointer text-white hover:text-gray-300 transition"
                onClick={() => navigate(-1)}
              />
              <h2 className="text-xl font-semibold">Filter by Category</h2>
            </div>

            {/* Categories */}
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-200px)]">
              {categories.map((cat, index) => (
                <label
                  key={index}
                  className={`block px-3 py-2 rounded cursor-pointer transition ${
                    selectedCategory === cat
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-700"
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </label>
              ))}
            </div>
          </div>
        </form>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-[260px] p-6 mt-16">
        <h1 className="text-3xl font-bold mb-6">
          {selectedCategory === "All" ? "All Courses" : selectedCategory}
        </h1>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course._id}
                thumbnail={course.thumbnail}
                title={course.title}
                category={course.category}
                price={course.price}
                id={course._id}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-lg">No courses found</p>
        )}
      </main>
    </div>
  );
};

export default AllCourses;




