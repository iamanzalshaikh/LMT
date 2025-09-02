import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: null,
  isLoading: false,
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    updateUserEnrollment: (state, action) => {
      const { courseId } = action.payload;
      if (state.userData) {
        // Initialize enrolledCourses if it doesn't exist
        if (!state.userData.enrolledCourses) {
          state.userData.enrolledCourses = [];
        }
        
        // Add courseId if not already enrolled
        const isAlreadyEnrolled = state.userData.enrolledCourses.some(
          course => (typeof course === 'string' ? course : course._id) === courseId
        );
        
        if (!isAlreadyEnrolled) {
          state.userData.enrolledCourses.push(courseId);
        }
      }
    },
    clearUserData: (state) => {
      state.userData = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setUserData, 
  updateUserEnrollment, 
  clearUserData, 
  setLoading, 
  setError 
} = userSlice.actions;

export default userSlice.reducer;