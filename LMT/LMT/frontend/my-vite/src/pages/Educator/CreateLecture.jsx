import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeftLong  } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { setLectureData } from '../../redux/lectureSlice';
import { toast } from 'react-toastify';
import { FaEdit } from 'react-icons/fa';

const CreateLecture = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [lectureTitle, setLectureTItle] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { lectureData } = useSelector(state => state.lecture);

  const handleCreateLecture = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/course/createlecture/${courseId}`,
        { lectureTitle },
        { withCredentials: true }
      );
      dispatch(
        setLectureData([
          ...(Array.isArray(lectureData) ? lectureData : []),
          result.data.lecture,
        ])
      );
      setLectureTItle("");
      toast.success('Lecture added');
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!courseId) return;
    const getCourseLecture = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/course/courselecture/${courseId}`,
          { withCredentials: true }
        );
        dispatch(setLectureData(result.data.course.lectures));
      } catch (error) {
        console.log(error);
      }
    };
    getCourseLecture();
  }, [courseId, dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-2xl p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-1">
            Let's add a Lecture
          </h1>
          <p className="text-sm text-gray-500">
            Enter the title and add your video lectures to enhance your course
          </p>
        </div>

        {/* Input Area */}
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black mb-4"
          placeholder="e.g. Introduction to MERN Stack"
          onChange={(e) => setLectureTItle(e.target.value)}
          value={lectureTitle}
        />

        {/* Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => navigate(`/editCourse/${courseId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            <FaArrowLeftLong /> Back to Course
          </button>
          <button
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCreateLecture}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Create Lecture"}
          </button>
        </div>

        {/* Lecture list */}
        <div className="space-y-2">
          {lectureData?.map((lecture, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-md flex justify-between items-center p-3 text-sm font-medium text-gray-700"
            >
              <span>Lecture - {index + 1} : {lecture.lectureTitle}</span>
              <button
                onClick={() =>
                  navigate(`/editlecture/${courseId}/${lecture._id}`)
                }
                className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
              >
                <FaEdit /> Edit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
