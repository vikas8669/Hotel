const express = require("express");
const router = express.Router();
const { submitRating, getAverageRating } = require("../controllers/ratingController");
const { verifyTokenAndFetchUser } = require("../middleware/authMiddleware"); // Replace with your actual auth middleware

// Route to submit or update a rating
router.post("/:id/rate", verifyTokenAndFetchUser, submitRating);

// Route to get average rating of a hotel
router.get("/:id/average-rating", getAverageRating);

module.exports = router;
