// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { serverUrl } from "../App";
// import { setCreatorCourseData } from "../redux/courseSlice";  // ✅ lowercase 'c'


// const getCreatorCourse = () => {
//   const dispatch = useDispatch();
//   const {userData} = useSelector(state=>state.user)

//   useEffect(() => {
//     const CreatorCourses = async () => {
//       try {
//         const result = await axios.get(`${serverUrl}/api/course/getcreator`, {
//           withCredentials: true,
//         });
//         console.log(result.data);
// dispatch(setCreatorCourseData(result.data));
//       } catch (error) {
//         console.error(error);
//         toast.error(error.response?.data?.message || "Failed to fetch courses");
//       }
//     };

//    CreatorCourses();
//   }, [userData] );
// };

// export default getCreatorCourse;


import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../App";
import { setCreatorCourseData } from "../redux/courseSlice"; // ✅ matches your slice

const getCreatorCourse = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const CreatorCourses = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/course/getcreator`, {
          withCredentials: true,
        });
        console.log(result.data);
        dispatch(setCreatorCourseData(result.data)); // ✅ fix
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to fetch courses");
      }
    };

    CreatorCourses();
  }, [userData]);
};

export default getCreatorCourse;
