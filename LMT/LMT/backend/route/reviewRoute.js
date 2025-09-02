import express from "express";
import {
  addReview,
  deleteReview,
  getReviews,
  updateReview
} from "../controller/reviewController.js"; // ✅ Correct path
import isAuth from "../middleware/isAuth.js"; // if using authentication

const router = express.Router();

router.get("/:courseId", getReviews);
router.post("/:courseId", isAuth, addReview);
router.put("/:reviewId", isAuth, updateReview);
router.delete("/:reviewId", isAuth, deleteReview);

export default router;
