import React, { useState, useRef } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const form = useRef(null); // form reference for emailjs

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("All fields are required!");
      return;
    }

    emailjs
      .sendForm("service_vcxjqk6", "template_t6pwuzs", form.current, {
        publicKey: "X-bRY407MQ_aHmy33",
      })
      .then(
        async () => {
          try {
            const res = await axios.post("http://localhost:5000/api/contact", formData);
            toast.success("Message sent & saved successfully!");

            if (res.status === 200) {
              setFormData({ name: "", email: "", message: "" });
              form.current.reset();
            }
          } catch (err) {
            console.error(err);
            toast.error("Failed to save to DB.");
          }
        },
        (error) => {
          console.log("FAILED...", error.text);
          toast.error("Email sending failed!");
        }
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Contact Us
        </h1>
        <p className="text-lg text-center text-gray-600 mb-8">
          Have questions or need help? Reach out to us, and we'll get back to you soon.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
          <form
            ref={form}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500"
                rows="4"
                placeholder="Write your message"
                required
              ></textarea>
            </div>
            <div className="sm:col-span-2 text-center">
              <button
                type="submit"
                className="bg-red-600 text-white py-3 px-8 rounded-lg hover:bg-red-700 transition"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-extrabold text-gray-800">
            Our Location
          </h2>
          <p className="text-gray-600 mt-4">Phagwara-144401 (Bom.)</p>
          <p className="text-gray-600">Email: support@Wanderlust.com</p>
          <p className="text-gray-600">Phone: +91 9914089806</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;