const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
require("dotenv").config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const { amount, currency = "INR" } = req.body;

  try {
    const options = {
      amount, // amount in paise
      currency,
      receipt: `rcptid_${Math.random().toString(36).substring(7)}`,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);
    res.status(200).json(order); // Return order to frontend
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    // Signature verification
    if (razorpay_signature === expectedSign) {
      // Payment verified successfully. Now, create the booking record

      const {
        userId,
        hotelId,
        roomType,
        checkInDate,
        checkOutDate,
        numberOfRooms,
        totalPrice,
        guests,
        specialRequests,
        phone,
      } = req.body;

      if (
        !userId ||
        !hotelId ||
        !roomType ||
        !checkInDate ||
        !checkOutDate ||
        !numberOfRooms ||
        !totalPrice
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Incomplete booking details" });
      }

      // Create the payment record in the database
      const payment = await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount: totalPrice, // Store the amount in paise
        status: "success",
      });

      // Now create the booking
      const newBooking = new Booking({
        userId,
        hotelId,
        phone,
        roomType,
        checkInDate,
        checkOutDate,
        numberOfRooms,
        totalPrice,
        guests: guests || 1,
        specialRequests: specialRequests || "",
        paymentStatus: "Paid", // Payment status
      });

      const savedBooking = await newBooking.save();

      res.status(200).json({
        success: true,
        message: "Payment verified & booking saved",
        booking: savedBooking,
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.log("Payment verification failed:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { createOrder, verifyPayment };
