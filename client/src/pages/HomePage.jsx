import React, { useEffect, useState } from "react";
import { useSearch } from "../context/SearchContext";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Image from "../components/Image";
import { API_URL } from "../Config";
import { FaRobot } from "react-icons/fa"; // Import the robot icon for the chatbot

// Background images
import img1 from "../assets/bg-1.jpg";
import img2 from "../assets/bg-2.jpg";
import img3 from "../assets/bg-3.jpg";
import img4 from "../assets/bg-4.jpg";
import img5 from "../assets/bg-5.jpg";
import img6 from "../assets/bg-6.jpg";
import img7 from "../assets/bg-7.jpg";
import img8 from "../assets/bg-8.jpg";

const backgroundImages = [img1, img2, img3, img4, img5, img6, img7, img8];

const HomePage = () => {
  const { searchTerm } = useSearch();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate(); // useNavigate hook for navigation

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % backgroundImages.length
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch(`${API_URL}/api/hotels`);
        const data = await response.json();
        setHotels(data);
        setFilteredHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = hotels.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.pricePerNight.toString().includes(searchTerm)
      );
      setFilteredHotels(filtered);
    } else {
      setFilteredHotels(hotels);
    }
  }, [searchTerm, hotels]);

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative w-full h-[300px] sm:h-[400px] flex items-center justify-center bg-cover bg-center rounded-none md:rounded-xl overflow-hidden shadow-md transition-all duration-500"
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        }}
      >
        <div className="absolute inset-0"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold drop-shadow-lg">
            Welcome to WonderLust
          </h1>
          <p className="mt-4 text-lg sm:text-xl">
            Discover the best destinations for your next adventure
          </p>
        </div>
      </div>

      {/* Chatbot Icon */}
      <div
        className="fixed bottom-8 right-8 bg-blue-600 p-4 rounded-full text-white shadow-lg hover:scale-105 cursor-pointer transition-all"
        onClick={() => navigate("/chat")}
      >
        <FaRobot className="text-3xl" />
      </div>

      {/* Hotels Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Popular Hotels
          </h2>
          <p className="mt-2 text-gray-500">
            Find your perfect stay from our curated list
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <Link
                to={`/hotel/${hotel._id}`}
                key={hotel._id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-200 hover:scale-[1.015]"
              >
                <div className="aspect-square rounded-t-3xl overflow-hidden">
                  <Image
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                    src={hotel.photos?.[0] || "/fallback.jpg"}
                    alt={hotel.name}
                  />
                </div>
                <div className="p-4 space-y-1">
                  <h2 className="text-lg font-semibold text-gray-700 truncate">
                    {hotel.name}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">
                    {hotel.address}
                  </p>
                  <p className="text-xl font-bold text-blue-600 mt-2">
                    ₹{hotel.pricePerNight}
                    <span className="text-sm font-normal text-gray-600">
                      {" "}
                      / night
                    </span>
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-gray-500 col-span-full">
              No hotels match your search.
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HomePage;
