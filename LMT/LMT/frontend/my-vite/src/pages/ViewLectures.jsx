import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

const ViewLectures = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);

  const selectedCourse = courseData?.find((course) => course._id === courseId);

  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [otherCourses, setOtherCourses] = useState([]);

  useEffect(() => {
    if (selectedCourse?.lectures?.length > 0) {
      setSelectedLecture(selectedCourse.lectures[0]);
    }
  }, [selectedCourse]);

  useEffect(() => {
    const fetchCreator = async () => {
      if (!selectedCourse?.creator) return;
      try {
        const res = await axios.post(
          `${serverUrl}/api/course/creator`,
          { userId: selectedCourse.creator },
          { withCredentials: true }
        );
        const creator = res.data.userData || res.data;
        setCreatorData(creator);

        if (res.data?.courses) {
          const filtered = res.data.courses.filter(
            (c) => c._id !== selectedCourse._id
          );
          setOtherCourses(filtered);
        }
      } catch (err) {
        console.error("Error fetching creator info:", err);
      }
    };
    fetchCreator();
  }, [selectedCourse]);

  if (!selectedCourse) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Course not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex flex-col gap-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 w-fit"
      >
        ← Back
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDE: Video Player */}
        <div className="flex-1 bg-white rounded-xl shadow p-4">
          {selectedLecture ? (
            <>
              <h2 className="text-xl sm:text-2xl font-semibold mb-3">
                {selectedLecture.lectureTitle}
              </h2>
              {selectedLecture.videoUrl ? (
                <video
                  src={selectedLecture.videoUrl}
                  controls
                  className="w-full rounded-lg"
                />
              ) : (
                <p className="text-gray-500">
                  No video uploaded for this lecture yet.
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-600 text-center">
              Select a lecture to start watching 👆
            </p>
          )}
        </div>

        {/* RIGHT SIDE: Creator Info + Lecture List */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow p-4 flex flex-col gap-4">
          {/* Creator Info (Top) */}
          {creatorData && (
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-3">Course Creator</h3>
              <div className="flex items-center gap-4">
                {creatorData.photoUrl && (
                  <img
                    src={creatorData.photoUrl}
                    alt={creatorData.name}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                )}
                <div>
                  <p className="text-gray-700">
                    <strong>Name:</strong> {creatorData.name}
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {creatorData.email}
                  </p>
                </div>
              </div>

              {otherCourses.length > 0 && (
                <>
                  <h4 className="font-semibold mt-3">Other Courses:</h4>
                  <ul className="list-disc ml-5 text-gray-700">
                    {otherCourses.map((c) => (
                      <li key={c._id}>{c.title}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}

          {/* Lecture List (Scrollable) */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-semibold mb-3">Course Lectures</h3>
            {selectedCourse.lectures?.length > 0 ? (
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh]">
                {selectedCourse.lectures.map((lec) => (
                  <div
                    key={lec._id}
                    className={`p-3 rounded-lg cursor-pointer border ${
                      selectedLecture?._id === lec._id
                        ? "bg-blue-100 border-blue-400"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedLecture(lec)}
                  >
                    {lec.lectureTitle}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No lectures available for this course.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLectures;




// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { serverUrl } from "../App";
// import { setLectureData } from "../redux/lectureSlice";

// const ViewLectures = () => {
//   const { courseId } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { courseData } = useSelector((state) => state.course);
//   const { userData } = useSelector((state) => state.user);
//   const [creatorData, setCreatorData] = useState(null);
//   const [otherCourses, setOtherCourses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const selectedCourse = courseData?.find((course) => course._id === courseId);

//   useEffect(() => {
//     const fetchCreatorData = async () => {
//       if (!selectedCourse?.creator) return;

//       try {
//         const result = await axios.post(
//           `${serverUrl}/api/course/creator`,
//           { userId: selectedCourse.creator },
//           { withCredentials: true }
//         );

//         setCreatorData(result.data);

//         if (result.data?.courses) {
//           const filtered = result.data.courses.filter(
//             (c) => c._id !== selectedCourse._id
//           );
//           setOtherCourses(filtered);
//         }
//       } catch (error) {
//         console.error("Error fetching creator data:", error);
//         toast.error(
//           error.response?.data?.message || "Failed to load creator details"
//         );
//       }
//     };

//     const fetchLectures = async () => {
//       try {
//         const result = await axios.get(
//           `${serverUrl}/api/lecture/${courseId}`,
//           { withCredentials: true }
//         );
//         dispatch(setLectureData(result.data.lectures));
//       } catch (error) {
//         console.error("Error fetching lectures:", error);
//         toast.error(
//           error.response?.data?.message || "Failed to load lectures"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCreatorData();
//     fetchLectures();
//   }, [selectedCourse, courseId, dispatch]);

//   if (loading) {
//     return <div className="p-6 text-center">Loading lectures...</div>;
//   }

//   if (!selectedCourse) {
//     return <div className="p-6 text-center">Course not found</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 flex flex-col md:flex-row gap-6">
//       {/* Left Section (Video Player & Details) */}
//       <div className="flex-1 bg-white rounded-2xl shadow p-4">
//         <h2 className="text-xl font-bold">{selectedCourse.title}</h2>
//         <p className="text-sm text-gray-500">{selectedCourse.category}</p>
//         <video
//           className="w-full mt-4 rounded-lg"
//           controls
//           src={selectedCourse.previewVideo}
//         />
//       </div>

//       {/* Right Section (Lectures & Instructor) */}
//       <div className="w-full md:w-80 bg-white rounded-2xl shadow p-4">
//         <h3 className="text-lg font-semibold mb-2">All Lectures</h3>
//         {selectedCourse.lectures?.map((lecture) => (
//           <div
//             key={lecture._id}
//             className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
//             onClick={() => navigate(`/lecture/${lecture._id}`)}
//           >
//             <span>{lecture.title}</span>
//             <span>▶</span>
//           </div>
//         ))}
//         {creatorData && (
//           <div className="mt-4">
//             <h4 className="font-medium">Instructor</h4>
//             <p>{creatorData.name}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewLectures;
