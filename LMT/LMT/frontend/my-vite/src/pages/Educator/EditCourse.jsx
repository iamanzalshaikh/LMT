
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setCourseData } from "../../redux/courseSlice";

const EditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams(); // ✅ Matches route param name in your router

  const [isPublished, setIsPublised] = useState(false);
  const [selectCourse, setSelectCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setbackendImage] = useState(null);
  const [loading, setLoading] = useState(false);
const dispatch = useDispatch()
const {courseData} = useSelector(state=>state.course)
  // ✅ Fetch course details
  const getCourseById = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/course/getcourse/${courseId}`, // ✅ Dynamic ID
        {}, // empty body
        { withCredentials: true }
      );
      setSelectCourse(result.data);
      console.log("Fetched Course Data:", result.data);
    } catch (error) {
      console.log("Error fetching course:", error);
      toast.error("Failed to load course details");
    }
  };

  // ✅ Handle Save (Edit Course)
  const handleEditCourse = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subtitle); // ✅ Match backend key
      formData.append("description", description);
      formData.append("category", category);
      formData.append("level", level);
      formData.append("price", price);
      formData.append("isPublished", isPublished);

      if (backendImage) {
        formData.append("thumbnail", backendImage);
      }

      // ✅ API Call
      const result = await axios.post(
        `${serverUrl}/api/course/editcourse/${courseId}`, // ✅ Dynamic ID
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      console.log("Updated Course Data:", result.data);
   const updateData = result.data
if (updateData.isPublished) {
  const updatedCourse = courseData.map(c => c._id !== courseId ? updateData : c)
  if (!courseData.some(c => c._id == courseId))
     {
    updatedCourse.push(updateData)
  }
  dispatch(setCourseData(updatedCourse))
}
else{
const filterCourses = courseData.filter(c => c._id !== courseId);
  dispatch(setCourseData(filterCourses))
}

      setLoading(false);
      toast.success("Course Updated Successfully!");

      // ✅ Update local state instantly with updated course data
      setSelectCourse(result.data);

      // ✅ Navigate back to courses page with updated course (optional)
      navigate("/courses", { state: { updatedCourse: result.data } });
    } catch (error) {
      setLoading(false);
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update course");
    }
  };  

const handleRemoveCourse = async () => {
  setLoading(true);
  try {
    const result = await axios.delete(`${serverUrl}/api/course/remove/${courseId}`, {
      withCredentials: true,
    });
    console.log(result.data);
    const filterCourses = courseData.filter(c=> c._id !== courseId)
    dispatch(setCourseData(filterCourses))
    setLoading(false);
    toast.success("Course Removed Successfully");
    navigate("/courses");
  } catch (error) {
    console.error(error.response?.data || error);
    setLoading(false);
    toast.error(error.response?.data?.message || "Failed to remove course");
  }
};


  // ✅ Populate state when course data is fetched
  useEffect(() => {
    if (selectCourse) {
      setTitle(selectCourse.title || "");
      setSubtitle(selectCourse.subTitle || ""); // ✅ fixed key
      setDescription(selectCourse.description || "");
      setCategory(selectCourse.category || "");
      setLevel(selectCourse.level || "");
      setPrice(selectCourse.price || "");
      setFrontendImage(selectCourse.thumbnail || null);
      setIsPublised(selectCourse.isPublished || false);
    }
  }, [selectCourse]);

  useEffect(() => {
    if (courseId) {
      getCourseById();
    }
  }, [courseId]);

  // ✅ Handle Thumbnail Upload
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setbackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      {/* TOP BAR */}
      <div className="flex items-center justify-center gap-5 md:justify-between flex-col md:flex-row mb-6 relative">
        <FaArrowLeftLong
          className="top-[-20%] md:top-[20%] absolute left-0 md:left-[2%] w-[22px] h-[22px] cursor-pointer"
          onClick={() => navigate("/courses")}
        />
        <h2 className="text-2xl font-semibold md:pl-[60px] text-center md:text-left">
          Add Details Information Regarding the Course
        </h2>
        <div>
          <button className="bg-black text-white px-4 py-2 rounded-md" onClick={() => navigate(`/createlecture/${selectCourse?._id}`)}

      >
            Go to Lecture Page
          </button>
        </div>
      </div>

      {/* FORM DETAILS */}
      <div className="bg-gray-50 p-6 rounded-md">
        <h2 className="text-lg font-medium mb-4">Basic Course Information</h2>

        {/* Publish / Unpublish Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {isPublished ? (
            <button
              className="bg-red-100 text-red-600 px-4 py-2 rounded-md border"
              onClick={() => setIsPublised((prev) => !prev)}
            >
              Click to UnPublish
            </button>
          ) : (
            <button
              className="bg-green-100 text-green-600 px-4 py-2 rounded-md border"
              onClick={() => setIsPublised((prev) => !prev)}
            >
              Click to Publish
            </button>
          )}
          <button className="bg-red-600 text-white px-4 py-2 rounded-md" onClick={handleRemoveCourse}>
            Remove Course
          </button>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleEditCourse}>
          {/* Thumbnail Upload */}
          <div>
            <label
              htmlFor="thumbnail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Course Thumbnail
            </label>
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              className="w-full border px-4 py-2 rounded-md"
              onChange={handleThumbnailChange}
            />
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Subtitle */}
          <div>
            <label
              htmlFor="subtitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subtitle
            </label>
            <input
              id="subtitle"
              type="text"
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Course Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              className="w-full border px-4 py-2 rounded-md h-24 resize-none"
              placeholder="Course Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category, Level & Price */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            {/* Category */}
            <div className="flex-1">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Category
              </label>
              <select
                id="category"
                className="w-full border px-4 py-2 rounded-md bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
                  -- Select a Category --
                </option>
                <option value="Data Analytics">Data Analytics</option>
                <option value="Ethical Hacking">Ethical Hacking</option>
                <option value="UI UX Designing">UI/UX Designing</option>
                <option value="Web Development">Web Development</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Level */}
            <div className="flex-1">
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Course Level
              </label>
              <select
                id="level"
                className="w-full border px-4 py-2 rounded-md bg-white"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">Select Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advance">Advance</option>
              </select>
            </div>

            {/* Price */}
            <div className="flex-1">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price (₹)
              </label>
              <input
                id="price"
                type="number"
                className="w-full border px-4 py-2 rounded-md"
                placeholder="Enter Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Thumbnail Preview at Bottom */}
          {frontendImage && (
            <div className="mt-6">
              <p className="text-gray-700 font-medium mb-2">
                Thumbnail Preview:
              </p>
              <img
                src={frontendImage}
                alt="Course Thumbnail Preview"
                className="w-full max-w-md h-48 object-cover rounded-md border"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              onClick={() => navigate("/courses")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
