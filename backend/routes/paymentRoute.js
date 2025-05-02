const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment  } = require('../controllers/PaymentController');
// const { verifyTokenAndFetchUser } = require("../middleware/authMiddleware");
// Create Razorpay order
router.post('/order',createOrder);

// Verify payment (callback from Razorpay)
router.post('/verify', verifyPayment);


module.exports = router;
