const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  averageRating: {
    type: Number,
    default: 0,
  }
  
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Optional: Prevent a user from rating the same hotel multiple times
ratingSchema.index({ hotel: 1, user: 1 }, { unique: true });

const RatingModel = mongoose.model("Rating", ratingSchema);

module.exports = RatingModel;
