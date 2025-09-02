import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import img from '../../assets/empty.jpg';
import getCreatorCourse from '../../customsHooks/getCreatorCourse';

const Courses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { creatorCourseData } = useSelector((state) => state.course);

  // ✅ Fetch courses using custom hook
  getCreatorCourse();

  useEffect(() => {
    if (location.state?.reload) {
      // refetch courses by calling the hook again
      getCreatorCourse();
    }
  }, [location.state]);

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='w-full min-h-screen p-4 sm:p-6 bg-gray-100'>
        {/* Header */}
        <div className='flex items-center justify-center gap-3 mb-6'>
          <FaArrowLeftLong
            className='w-[22px] h-[22px] cursor-pointer'
            onClick={() => navigate("/dashboard")}
          />
          <h1 className='text-2xl font-semibold'>All Created Courses</h1>
        </div>

        {/* Create Button */}
        <button
          className='bg-black text-white px-4 py-2 rounded hover:bg-gray-500 mb-6'
          onClick={() => navigate("/createcourses")}
        >
          Create Courses
        </button>

        {/* Courses Table */}
        <div className='hidden md:block bg-white rounded-xl shadow p-4 overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead className='border-b bg-gray-50'>
              <tr>
                <th className='text-left py-3 px-4'>Courses</th>
                <th className='text-left py-3 px-4'>Prices</th>
                <th className='text-left py-3 px-4'>Status</th>
                <th className='text-left py-3 px-4'>Action</th>
              </tr>
            </thead>
            <tbody>
              {creatorCourseData?.map((course, index) => (
                <tr key={course._id || index} className='border-b hover:bg-gray-50 transition duration-200'>
                  <td className='py-3 px-4 flex items-center gap-4'>
                    <img
                      src={course?.thumbnail || img}
                      className='w-24 h-14 object-cover rounded-md'
                      alt={course.title || 'course thumbnail'}
                    />
                    <span>{course?.title || 'Untitled Course'}</span>
                  </td>
                  <td className='px-4 py-3'>${course.price || 'NA'}</td>
                  <td className='px-4 py-3'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        course.isPublished
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <FaEdit
                      className='cursor-pointer text-gray-600 hover:text-black'
                      onClick={() => navigate(`/EditCourse/${course?._id}`, { state: { reload: true } })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Small screen */}
        <div className="md:hidden space-y-4">
          {creatorCourseData?.map((course, index) => (
            <div
              key={course._id || index}
              className="bg-white rounded-xl shadow p-4 flex items-center gap-4"
            >
              <img
                src={course.thumbnail || img}
                className="w-24 h-14 object-cover rounded-md"
                alt={course.title || 'course thumbnail'}
              />
              <div className="flex-1">
                <h2 className="text-base font-medium">{course.title || 'Untitled Course'}</h2>
                <p className="text-sm text-gray-600">${course.price || 'NA'}</p>
                <span
                  className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                    course.isPublished
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <FaEdit
                className="cursor-pointer text-gray-600 hover:text-black"
                onClick={() => navigate(`/EditCourse/${course?._id}`, { state: { reload: true } })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
