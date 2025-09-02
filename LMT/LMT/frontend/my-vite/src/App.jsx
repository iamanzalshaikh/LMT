import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import { ToastContainer } from 'react-toastify'
import getCurrentUser from "./customsHooks/getCurrentUser";
import { useSelector } from 'react-redux'
import Profile from './pages/Profile.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import EditProfile from './pages/EditProfile.jsx'
import Dashboard from './pages/Educator/Dashboard.jsx'
import Courses from './pages/Educator/Courses.jsx'
import CreateCourses from './pages/Educator/CreateCourses.jsx'
import getCreatorCourse from './customsHooks/getCreatorCourse.js'
import EditCourse from './pages/Educator/EditCourse.jsx'
import getPublishedCourse from './customsHooks/getPublishedCourse.js'
import AllCourses from './pages/Educator/AllCourses.jsx'
import CreateLecture from './pages/Educator/CreateLecture.jsx'
import EditLecture from './pages/Educator/EditLecture.jsx'
import ViewCourse from './pages/ViewCourse.jsx'
import ScrollToTop from './component/ScrollToTop.jsx'
import ViewLectures from './pages/ViewLectures.jsx'
import SearchWithAi from './pages/SearchWithAi.jsx'
export const serverUrl = "https://lmt-backend-yv4u.onrender.com"
const App = () => {
getCurrentUser()
getCreatorCourse()
getPublishedCourse()
const {userData} = useSelector(state=>state.user)
  return (
    <div>
      <ToastContainer />
       <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={!userData ? <Signup /> : <Navigate to = {"/"}/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={userData ? <Profile /> : <Navigate to = {"/signup"} /> }/>
        <Route path="/forgetpassword" element={!userData ? <ForgetPassword /> : <Navigate to = {"/signup"} /> }/>
        <Route path="/editprofile" element={userData ? <EditProfile /> : <Navigate to = {"/signup"} /> }/>
        <Route path="/Dashboard" element={userData ?.role ===  "educator"?  <Dashboard /> : <Navigate to = {"/signup"} /> }/>
        <Route path="/courses" element={userData ?.role ===  "educator"?  <Courses /> : <Navigate to = {"/signup"} /> }/>
        <Route path="/createcourses" element={userData ?.role ===  "educator"?  <CreateCourses /> : <Navigate to = {"/signup"} /> }/>
        <Route path="/allcourses" element={userData ? <AllCourses /> : <Navigate to = {"/signup"} /> }/>
        <Route path="/createlecture/:courseId" element={userData ?.role ===  "educator"?  <CreateLecture /> : <Navigate to = {"/signup"} /> }/>
        <Route path="/editlecture/:courseId/:lectureId" element={userData ?.role ===  "educator"?  <EditLecture /> : <Navigate to = {"/signup"} /> }/>
<Route
  path="/viewCourse/:courseId"
  element={userData ? <ViewCourse /> : <Navigate to="/signup" />}
/>


   <Route path="/viewlecture/:courseId" element={userData? <ViewLectures /> : <Navigate to="/signup" />} />

         {/* <Route 
  path="/editlecture/:lectureId/:courseId" 
              element={userData?.role === "educator" ? <EditLecture /> : <Navigate to="/signup" />} 
          /> */}


<Route
  path="/editCourse/:courseId"
  element={userData?.role === "educator" ? <EditCourse /> : <Navigate to="/signup" />}
/>

<Route
  path="/Search"
  element={userData ? <SearchWithAi /> : <Navigate to="/signup" />}
/>






      </Routes>
    </div>
  )
}

export default App
