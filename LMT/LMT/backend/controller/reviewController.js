import Review from "../model/reviewModel.js"; // ✅ Correct path
import Course from "../model/CoursesModel.js";

// Add Review
export const addReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingReview = await Review.findOne({ course: courseId, user: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this course" });
    }

    const review = new Review({
      course: courseId,
      user: req.user._id,
      rating,
      comment,
    });

    const savedReview = await review.save();

    course.reviews.push(savedReview._id);
    await course.save();

    res.status(201).json({ message: "Review added successfully", review: savedReview });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ message: "Server error while adding review" });
  }
};

// Get Reviews
export const getReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ course: courseId })
      .populate("user", "name photoUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Get Reviews Error:", error);
    res.status(500).json({ message: "Server error while fetching reviews" });
  }
};

// Update Review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own review" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();
    res.status(200).json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error("Update Review Error:", error);
    res.status(500).json({ message: "Server error while updating review" });
  }
};

// Delete Review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own review" });
    }

    await review.deleteOne();
    await Course.findByIdAndUpdate(review.course, { $pull: { reviews: review._id } });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ message: "Server error while deleting review" });
  }
};
