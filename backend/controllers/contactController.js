const Contact = require("../models/Conact");

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ success: true, message: "Message received!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
