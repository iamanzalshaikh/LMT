import React, { useEffect, useState, useMemo } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setSelectedCourse } from '../redux/courseSlice';
import { updateUserEnrollment } from '../redux/userSlice'; // Add this action
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';

const ViewCourse = () => {
  const navigate = useNavigate();
  const { courseData } = useSelector((state) => state.course);
  const { courseId } = useParams();
  const { selectedCourse } = useSelector((state) => state.course);
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // Remove local isEnrolled state - we'll compute it dynamically
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [creatorData, setCreatorData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [otherCourses, setOtherCourses] = useState([]);

  // Compute enrollment status dynamically using useMemo
  const isEnrolled = useMemo(() => {
    if (!userData?.enrolledCourses || !courseId) return false;
    
    return userData.enrolledCourses.some(enrolledCourse => {
      // Handle both string IDs and object references
      const enrolledCourseId = typeof enrolledCourse === 'string' 
        ? enrolledCourse 
        : enrolledCourse._id || enrolledCourse.id;
      
      return enrolledCourseId?.toString() === courseId?.toString();
    });
  }, [userData?.enrolledCourses, courseId]);

  const fetchCourseData = async () => {
    courseData.forEach((course) => {
      if (course._id === courseId) {
        dispatch(setSelectedCourse(course));
        setReviews(course.reviews || []);
      }
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.rating || !newReview.comment.trim()) {
      alert("Please add a rating and a comment!");
      return;
    }

    const reviewData = {
      user: userData?.name || "Current User",
      rating: newReview.rating,
      comment: newReview.comment,
    };

    setReviews([reviewData, ...reviews]);
    setNewReview({ rating: 0, comment: "" });
  };

  // Fetch Creator Data + Other Courses
  useEffect(() => {
    const handleCreator = async () => {
      if (!selectedCourse?.creator) return;

      try {
        const result = await axios.post(
          `${serverUrl}/api/course/creator`,
          { userId: selectedCourse.creator },
          { withCredentials: true }
        );

        setCreatorData(result.data);

        if (result.data?.courses) {
          const filtered = result.data.courses.filter(
            (c) => c._id !== selectedCourse._id
          );
          setOtherCourses(filtered);
        }
      } catch (error) {
        console.error("Error fetching creator data:", error);
      }
    };

    handleCreator();
  }, [selectedCourse]);

  const handleEnroll = async (userId, courseId) => {
    try {
      // 1️⃣ Create order on backend
      const { data: orderData } = await axios.post(
        `${serverUrl}/api/order/razorpay-order`,
        { userId, courseId },
        { withCredentials: true }
      );

      toast.success("Order created successfully!");

      // 2️⃣ Prepare Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Your App Name",
        description: "Course Purchase",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment on backend
            const verifyRes = await axios.post(
              `${serverUrl}/api/order/verifypayment`, 
              {
                ...response,
                userId,
                courseId,
              },
              { withCredentials: true }
            );

            // 4️⃣ Update Redux store with enrollment
            dispatch(updateUserEnrollment({ courseId }));
            
            toast.success("Payment successful! You are now enrolled!");
            console.log("Payment verified:", verifyRes.data);
          } catch (err) {
            toast.error("Payment verification failed!");
            console.error(err);
          }
        },
        prefill: {
          name: userData?.name || "User Name",
          email: userData?.email || "user@example.com",
          contact: userData?.phone || "9999999999",
        },
        theme: {
          color: "#2563eb",
        },
      };

      // 4️⃣ Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Failed to create order!");
      console.error(error);
    }
  };

  const handleWatchNow = () => {
    // Navigate to course player or learning interface
    navigate(`/course-player/${courseId}`);
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseData, courseId]);

  // Debug log to check enrollment status
  console.log('Current enrollment status:', {
    isEnrolled,
    courseId,
    userEnrolledCourses: userData?.enrolledCourses
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">
        {/* TOP */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          <div className="w-full md:w-1/2">
            <FaArrowLeftLong
              className="text-[black] w-[22px] h-[22px] cursor-pointer"
              onClick={() => navigate("/")}
            />
            {selectedCourse?.thumbnail ? (
              <img
                src={selectedCourse?.thumbnail}
                alt=""
                className="rounded-xl w-full object-cover"
              />
            ) : (
              <img
                src=""
                alt="No Thumbnail"
                className="rounded-xl w-full object-cover"
              />
            )}
          </div>

          {/* Course info */}
          <div className="flex-1 space-y-2 mt-[20px] ">
            <h2 className="text-2xl font-bold">{selectedCourse?.title}</h2>
            <p className="text-gray-600">{selectedCourse?.subTitle}</p>

            <div className="flex items-start flex-col justify-between">
              <div className="text-yellow-500 font-medium flex gap-2">
                <span className="flex items-center justify-start gap-1">
                  <FaStar /> 5
                </span>
                <span className="text-gray-400">(1,200 reviews)</span>
              </div>

              <div>
                <span className="text-lg font-semibold text-black">
                  {selectedCourse?.price}₹
                </span>{" "}
                <span className="line-through text-sm text-gray-400">2099₹</span>
              </div>

              <ul className="text-sm text-gray-700 space-y-1 pt-2">
                <li>10+ hours of video content</li>
                <li>Lifetime access to course material</li>
              </ul>

              {/* Fixed Button Logic */}
             {!isEnrolled ? (
  <button 
    className="bg-[black] text-white px-6 py-2 rounded hover:bg-gray-700 mt-3 cursor-pointer transition-colors" 
    onClick={() => handleEnroll(userData?._id, courseId)}
    disabled={!userData}
  >
    {userData ? 'Enroll Now' : 'Login to Enroll'}
  </button>
) : (
<button 
  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 mt-3 cursor-pointer transition-colors"
  onClick={() => {
    if (userData?.role === "educator") {
      navigate(`/viewlecture/${courseId}`);
    } else {
      navigate(`/viewlecture/${courseId}`); // ✅ Students go to course player
    }
  }}
>
  Watch Now ✓
</button>

)}

            </div>
          </div>
        </div>

        {/* What You Learn */}
        <div>
          <h2 className="text-xl font-semibold mb-2">What you Learn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Learn {selectedCourse?.category} from Beginning</li>
          </ul>
        </div>

        {/* Who This Course is For */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Who This Course is For</h2>
          <p className="text-gray-700">
            Beginner, aspiring developers, and professionals looking to upgrade skills.
          </p>
        </div>

        {/* Curriculum + Preview */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Course Curriculum Card */}
          <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-1 text-gray-800">
              Course Curriculum
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedCourse?.lectures?.length} lectures
            </p>

            {/* Lecture List */}
            <div className="flex flex-col gap-3">
              {selectedCourse?.lectures?.map((lecture, index) => (
                <button
                  key={lecture._id || index}
                  disabled={!lecture.isPreviewFree && !isEnrolled}
                  onClick={() => {
                    if (lecture.isPreviewFree || isEnrolled) {
                      setSelectedLecture(lecture);
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
                    lecture.isPreviewFree || isEnrolled
                      ? "hover:bg-pink-50 hover:border-pink-400 cursor-pointer"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {lecture.isPreviewFree || isEnrolled ? "🎬 Available" : "🔒 Locked"} –{" "}
                  {lecture.lectureTitle}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1">
            {selectedLecture ? (
              <div className="p-6 border rounded-xl bg-white shadow-md">
                <h3 className="text-lg font-semibold mb-2">
                  {selectedLecture.lectureTitle}
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedLecture.description}
                </p>
                {selectedLecture.videoUrl && (
                  <video
                    src={selectedLecture.videoUrl}
                    controls
                    className="w-full rounded-lg border"
                  />
                )}
              </div>
            ) : (
              <p className="text-gray-500 mt-4">
                Select a lecture to preview 👆
              </p>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Student Reviews</h2>

          {reviews && reviews.length > 0 ? (
            <div className="space-y-4 mb-6">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50 flex flex-col"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">
                      {review.user || "Anonymous"}
                    </span>
                    <div className="flex text-yellow-500">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-4">
              No reviews yet. Be the first to review this course!
            </p>
          )}

          {/* Write Review Form - Only show if enrolled */}
          {isEnrolled && (
            <form
              onSubmit={handleReviewSubmit}
              className="p-6 border rounded-xl bg-white shadow-md"
            >
              <h3 className="text-lg font-semibold mb-3">Write a Review</h3>

              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer text-2xl ${
                      newReview.rating >= star
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                    onClick={() =>
                      setNewReview((prev) => ({ ...prev, rating: star }))
                    }
                  />
                ))}
              </div>

              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder="Write your review..."
                className="w-full border rounded-lg p-3 text-gray-700 mb-4"
                rows={4}
              ></textarea>

              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-700"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>

        {/* More Courses by Creator */}
        {creatorData && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">
              More courses by {creatorData?.name || "this creator"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courseData
                .filter(
                  (course) =>
                    course.creator === selectedCourse?.creator &&
                    course._id !== selectedCourse?._id
                )
                .map((course) => (
                  <div
                    key={course._id}
                    className="border rounded-lg p-4 shadow hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate(`/viewCourse/${course._id}`)}
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="rounded-lg w-full h-40 object-cover mb-3"
                    />
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-gray-600">{course.subTitle}</p>
                    <span className="text-black font-bold">{course.price}₹</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCourse;