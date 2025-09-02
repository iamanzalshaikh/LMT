import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setLectureData } from "../../redux/lectureSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../../App";
import { FaArrowLeftLong } from "react-icons/fa6"; // ✅ import icon

function EditLecture() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get lectureId and courseId from URL params
  const { lectureId, courseId } = useParams();

  const lectureData = useSelector((state) => state.lecture.lectureData);

  // Find the selected lecture from Redux
  const selectedLecture = lectureData.find((lecture) => lecture._id === lectureId);

  const [title, setTitle] = useState(selectedLecture ? selectedLecture.lectureTitle : "");
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoPreview, setVideoPreview] = useState(selectedLecture?.videoUrl || null);
  const [isPreviewFree, setIsPreviewFree] = useState(
    selectedLecture ? selectedLecture.isPreviewFree : false
  );
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);

  // Handle Edit Lecture
  const handleEditLecture = async () => {
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("lectureTitle", title);
      formdata.append("isPreviewFree", isPreviewFree);
      if (videoUrl) formdata.append("videoUrl", videoUrl);

      const result = await axios.post(
        serverUrl + `/api/course/editlecture/${lectureId}`,
        formdata,
        { withCredentials: true }
      );

      // Replace updated lecture in Redux
      const updatedLectures = lectureData.map((lec) =>
        lec._id === lectureId ? result.data.lecture : lec
      );
      dispatch(setLectureData(updatedLectures));

      toast.success("Lecture updated successfully");
      navigate("/courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating lecture");
    } finally {
      setLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoUrl(file);
      const objectUrl = URL.createObjectURL(file);
      setVideoPreview(objectUrl);
    }
  };

  // Remove Lecture
  const handleremove = async () => {
    setLoading1(true);
    try {
      await axios.delete(serverUrl + `/api/course/removelecture/${lectureId}`, {
        withCredentials: true,
      });
      navigate(`/createlecture/${courseId}`);
      toast.success("Lecture Removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unexpected error");
    } finally {
      setLoading1(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        {/* Back Button with Icon */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-2"
        >
          <FaArrowLeftLong className="text-lg" /> Back
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">Edit Lecture</h2>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* Lecture Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Lecture Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Enter Lecture Title"
              required
            />
          </div>

          {/* Video Upload */}
          <div className="mb-4">
            <label htmlFor="video" className="block text-sm font-medium text-gray-700">
              Lecture Video
            </label>
            <input
              type="file"
              id="video"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-md"
            />

            {/* Preview Video */}
            {videoPreview && (
              <div className="mt-4">
                <h3 className="text-sm text-gray-700">Preview:</h3>
                <video width="100%" controls>
                  <source src={videoPreview} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          {/* Free Checkbox */}
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={isPreviewFree}
                onChange={() => setIsPreviewFree(!isPreviewFree)}
                className="mr-2"
              />
              Is this video FREE?
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-between space-x-4">
            <button
              type="button"
              onClick={handleEditLecture}
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Update Lecture"}
            </button>

            <button
              type="button"
              disabled={loading1}
              onClick={handleremove}
              className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 disabled:bg-gray-400"
            >
              {loading1 ? "Removing..." : "Remove Lecture"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLecture;
