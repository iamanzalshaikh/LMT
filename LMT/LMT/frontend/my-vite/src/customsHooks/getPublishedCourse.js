import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setCourseData } from "../redux/courseSlice"; 

const getPublishedCourse = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCourseData = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/course/getpublished`, {
          withCredentials: true,
        });
dispatch(setCourseData(result.data.courses));        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    getCourseData();
  }, []);


};

export default getPublishedCourse;
