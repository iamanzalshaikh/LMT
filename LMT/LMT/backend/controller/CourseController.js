import uploadOnCloudinary from "../config/cloudinary.js";
import Course from "../model/CoursesModel.js";
import Lecture from "../model/lectureModel.js";
import User from "../model/userModel.js";


export const createCourse = async (req, res) => {
  try {
    const { title, category, description } = req.body; // ✅ include description too

    if (!title || !category) {
      return res.status(400).json({ message: "Title or Category is required" });
    }

    const course = await Course.create({
      title,
      category,
      description,
      creator: req.userId, // ✅ corrected reference
    });

    return res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    return res.status(500).json({ message: `Course creation error: ${error.message}` });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate("lectures")

    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: "No published courses found" });
    }

    return res.status(200).json({
      success: true,
      message: "Published courses fetched successfully",
      courses,
    });
  } catch (error) {
    return res.status(500).json({ message: `Failed to find published courses: ${error.message}` });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await Course.find({ creator: userId });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: "Courses not found" });
    }

    return res.status(200).json(courses);
  } catch (error) {
    return res.status(500).json({ message: `Failed to get creator courses: ${error.message}` });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, subTitle, description, category, isPublished, price , level } = req.body;
    let thumbnail;

    if (req.file) {
      thumbnail = await uploadOnCloudinary(req.file.path);
    }

    let course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const updateData = {
      title,
      subTitle,
      description,
      category,
      isPublished,
      price,
       level,
      thumbnail,
    };

    course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: `Failed to edit course: ${error.message}` });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json(course);
  } catch (error) {
    return res.status(500).json({ message: `Failed to get course by ID: ${error.message}` });
  }
};

export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ success: true, message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//Lectures conntroller

export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({ message: "Lecture title and courseId are required" });
    }

    const lecture = await Lecture.create({ lectureTitle });

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ Add lecture to course
    course.lectures.push(lecture._id);
    await course.save();


    await course.populate("lectures");
    return res.status(201).json({ lecture, course });

  } catch (error) {
    return res.status(500).json({ message: `Failed to create lecture: ${error.message}` });
  }
};

export const getCourseLecture = async(req , res) => {
  try {
    const {courseId} = req.params
    const course = await Course.findById(courseId)

    if(!course) {
      return res.status(400).json({message : "Course is not found"})
    }

    await course.populate("lectures")
    await course.save()
        return res.status(200).json({  course });


    
  } catch (error) {
    return res.status(500).json({ message: `Failed to get coourse lecture: ${error.message}` });

  }
}

export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { isPreviewFree, lectureTitle } = req.body;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ message: "Lecture is not found" });
    }

    let videoUrl;
    if (req.file) {
      videoUrl = await uploadOnCloudinary(req.file.path);
      lecture.videoUrl = videoUrl;
    }

    if (lectureTitle) {
      lecture.lectureTitle = lectureTitle;
    }

    lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    return res.status(200).json({ message: "Lecture updated successfully", lecture });

  } catch (error) {
    console.error("Error in editLecture:", error); 
    return res.status(500).json({ message: `Failed to edit lecture: ${error.message}` });
  }
};


export const removeLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    await Course.updateOne(
      { lectures: lectureId }, 
      { $pull: { lectures: lectureId } } 
    );

    return res.status(200).json({ message: "Lecture removed successfully" });

  } catch (error) {
    return res.status(500).json({ message: `Failed to remove lecture: ${error.message}` });
  }
};


//get Creator

export const getCreatorById = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Failed to get Creator: ${error.message}` });
  }
};
