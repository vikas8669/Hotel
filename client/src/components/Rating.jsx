import React, { useEffect, useState } from "react";
import axios from "axios";

const HotelRating = ({ hotelId }) => {
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Fetch average rating on mount
  const fetchAverageRating = async () => {
    try {
      const res = await axios.get(`/api/ratings/${hotelId}/average-rating`);
      setAverageRating(res.data.averageRating);
      setTotalRatings(res.data.totalRatings);
    } catch (err) {
      console.error("Failed to fetch rating", err);
      setMessage("Could not load the average rating.");
    }
  };

  // Submit or update rating
  const submitRating = async (e) => {
    e.preventDefault();
    if (userRating < 1 || userRating > 5) {
      return setMessage("Rating must be between 1 and 5");
    }

    try {
      setLoading(true);
      const res = await axios.post(`/api/ratings/${hotelId}/rate`, { rating: userRating });
      console.log(`/api/ratings/${hotelId}/rate`);
      setMessage(res.data.message);
      setAverageRating(res.data.averageRating); // Update average rating directly
      setTotalRatings(res.data.totalRatings); // Update total ratings directly
      setRatingSubmitted(true); // Mark the rating as submitted
    } catch (err) {
      console.error("Error submitting rating", err);
      setMessage("Could not submit rating, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAverageRating();
  }, [hotelId]);

  return (
    <div className="p-4 max-w-md bg-white rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">Rate this Hotel</h2>
      
      <form onSubmit={submitRating} className="space-y-2">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              type="button"
              key={num}
              className={`text-2xl ${num <= userRating ? "text-yellow-500" : "text-gray-400"}`}
              onClick={() => setUserRating(num)}
            >
              ★
            </button>
          ))}
        </div>
        
        <button
          type="submit"
          disabled={loading || userRating === 0}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Rating"}
        </button>
      </form>
      
      {message && <p className="text-green-600">{message}</p>}
      
      <div className="text-sm text-gray-700">
        <p>⭐ Average Rating: <strong>{averageRating}</strong></p>
        <p>🗳️ Total Ratings: <strong>{totalRatings}</strong></p>
      </div>

      {ratingSubmitted && (
        <p className="text-blue-500">Thank you for submitting your rating!</p>
      )}
    </div>
  );
};

export default HotelRating;
