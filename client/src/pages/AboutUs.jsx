import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-8">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-96 text-white flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://www.visa.gd/dam/VCOM/regional/lac/SPA/Default/affluent/VHLC/marquee-visa-luxury-hotel-collection-1600x900.jpg')",
        }}
      >
        <div className="bg-black bg-opacity-50 absolute inset-0"></div>
        <h1 className="text-5xl font-extrabold z-10 text-center">About Us</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto text-center mt-12 px-6">
        <p className="text-lg text-gray-700 mb-6">
          Welcome to our hotel booking platform, where comfort meets
          convenience. We’re dedicated to helping you find the perfect stay for
          your journey.
        </p>

        {/* About Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="relative">
            <img
              src="https://www.visa.gd/dam/VCOM/regional/lac/SPA/Default/affluent/VHLC/marquee-visa-luxury-hotel-collection-1600x900.jpg"
              alt="Luxury Hotel"
              className="rounded-xl shadow-lg w-full h-full object-cover"
            />
            {/* Overlay to dim the image */}
            <div className="absolute inset-0 bg-black bg-opacity-25 rounded-xl"></div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800">
              Why Choose Us?
            </h2>
            <p className="text-gray-600">
              Our mission is to make your stay as memorable as possible. We work
              with thousands of hotels worldwide to offer you the best deals
              across luxury, budget, and boutique accommodations. Whether you're
              traveling for business or leisure, we’ve got you covered.
            </p>
            <ul className="list-disc list-inside text-left text-gray-600 space-y-2">
              <li>Wide range of hotels to suit every budget.</li>
              <li>Seamless booking experience with user-friendly tools.</li>
              <li>24/7 customer support to ensure your satisfaction.</li>
              <li>Exclusive deals and discounts for loyal customers.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-20">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          What Our Guests Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Testimonial Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 transition transform hover:scale-105 hover:shadow-xl">
            <p className="text-gray-600 italic">
              “I found the perfect hotel for my trip within minutes. The booking
              process was so easy, and the customer service was exceptional.”
            </p>
            <h3 className="text-gray-800 font-semibold mt-4">- Vikas Kumar</h3>
          </div>
          {/* Testimonial Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 transition transform hover:scale-105 hover:shadow-xl">
            <p className="text-gray-600 italic">
              “This platform is a game changer. Great deals, smooth experience,
              and excellent support!”
            </p>
            <h3 className="text-gray-800 font-semibold mt-4">- BomX</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
