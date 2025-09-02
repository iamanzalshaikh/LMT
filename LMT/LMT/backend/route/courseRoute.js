import express from "express"
import isAuth from "../middleware/isAuth.js"
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorById, getCreatorCourses,  getPublishedCourses, removeCourse, removeLecture } from "../controller/CourseController.js"
import upload from "../middleware/multer.js"
import { searchWithAi } from "../controller/searchController.js"


const courseRouter = express.Router()


//courses
courseRouter.post("/create", isAuth , createCourse)
courseRouter.get("/getpublished" , getPublishedCourses)
courseRouter.get("/getcreator" , isAuth , getCreatorCourses)
courseRouter.post("/editcourse/:courseId", isAuth, upload.single("thumbnail"), editCourse)
courseRouter.post("/getcourse/:courseId" , isAuth , getCourseById)
courseRouter.delete("/remove/:courseId" , isAuth , removeCourse)

//lectures
courseRouter.post("/createLecture/:courseId" , isAuth , createLecture)
courseRouter.get("/courselecture/:courseId" , isAuth , getCourseLecture)
courseRouter.post("/editlecture/:lectureId" , isAuth , upload.single("videoUrl"), editLecture)
courseRouter.delete("/removelecture/:lectureId" , isAuth , removeLecture)
courseRouter.post("/creator" , isAuth , getCreatorById)


//for search
courseRouter.post("/search" , searchWithAi)


export default courseRouter;

