import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    creatorCourseData: null,
    courseData: null,
    selectedCourse:null,
  },
  reducers: {
    setCreatorCourseData: (state, action) => {
      state.creatorCourseData = action.payload;
    },
    setCourseData: (state, action) => {
      state.courseData = action.payload;
    },
    setSelectedCourse: (state , action) => {
      state.selectedCourse  = action.payload

    }
  },
});

// Destructure both actions together
export const { setCreatorCourseData, setCourseData, setSelectedCourse } = courseSlice.actions;

export default courseSlice.reducer;



// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   creatorCourseData: null,
// };

// const courseSlice = createSlice({
//   name: "course",
//   initialState,
//   reducers: {
//     setCreatorCourseData: (state, action) => {
//       state.creatorCourseData = action.payload;
//     },
//     clearCreatorCourseData: (state) => { // Optional: clear data
//       state.creatorCourseData = null;
//     },
//   },
// });

// export const { setCreatorCourseData, clearCreatorCourseData } = courseSlice.actions;
// export default courseSlice.reducer;
