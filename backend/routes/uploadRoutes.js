const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloud");
const { uploadImages } = require("../controllers/uploadController");

const upload = multer({ storage });

router.post("/upload", upload.array("photos", 50), uploadImages);

module.exports = router;
