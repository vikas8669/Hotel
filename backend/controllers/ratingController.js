const Rating = require("../models/Rating");
const Hotel = require("../models/Hotel");

// Submit or Update Rating
const submitRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user._id; // assuming auth middleware sets this
    const hotelId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Check for existing rating by this user
    const existing = await Rating.findOne({ hotel: hotelId, user: userId });

    if (existing) {
      existing.rating = rating;
      await existing.save();
    } else {
      const newRating = new Rating({ hotel: hotelId, user: userId, rating });
      await newRating.save();
    }

    // Recalculate average rating
    const allRatings = await Rating.find({ hotel: hotelId });
    const avgRating =
      allRatings.reduce((acc, curr) => acc + curr.rating, 0) /
      allRatings.length;

    hotel.averageRating = avgRating.toFixed(1);
    await hotel.save();

    res.json({
      message: "Rating submitted/updated",
      averageRating: avgRating.toFixed(1),
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting rating", error });
  }
};

// Get average rating for a hotel
const getAverageRating = async (req, res) => {
  try {
    const hotelId = req.params.id;

    const ratings = await Rating.find({ hotel: hotelId });

    if (!ratings.length) {
      return res.json({ averageRating: 0 });
    }

    const average =
      ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

    res.json({
      averageRating: average.toFixed(1),
      totalRatings: ratings.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching ratings", error });
  }
};

module.exports = { submitRating, getAverageRating };
