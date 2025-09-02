import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';

const CardPage = () => {
  const { courseData } = useSelector((state) => state.course);
  const [popularCourses, setPopularCourses] = useState([]);

  useEffect(() => {
   

    // Ensure data exists and slice only first 4 courses
    if (Array.isArray(courseData) && courseData.length > 0) {
      // You might want to map courseData to ensure each course has a valid ID
      const coursesWithIds = courseData.map((course) => ({
        ...course,
        id: course.id || course._id, // Check if `id` exists, else use `_id`
      }));

      setPopularCourses(coursesWithIds.slice(0, 4)); // Only first 4 courses
    } else {
      setPopularCourses([]); // Safe fallback when no data
    }
  }, [courseData]);

  return (
    <section className="px-6 md:px-16 py-16 bg-gray-50">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Our Popular Courses
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Explore top-rated courses designed to boost your skills,
          enhance careers, and unlock opportunities in tech, AI, business
          and beyond.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {popularCourses.length > 0 ? (
          popularCourses.map((course, index) => {
            // Ensure id is available before rendering
            if (!course.id) {
              console.error(`Course ID missing for: ${course.title}`);
              return null; // Skip rendering this course if id is missing
            }

            console.log('Course ID in CardPage:', course.id); // Ensure the id is present
            return (
              <Card
                key={index}
                thumbnail={course.thumbnail}
                title={course.title}
                category={course.category}
                price={course.price}
                id={course.id} // Ensure this is passed correctly
              />
            );
          })
        ) : (
          <p className="text-gray-500 text-lg col-span-4 text-center">
            No courses available
          </p>
        )}
      </div>
    </section>
  );
};

export default CardPage;
