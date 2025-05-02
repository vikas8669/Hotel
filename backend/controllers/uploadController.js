const uploadImages = async (req, res) => {
    try {
      const uploadedFiles = req.files.map(file => file.path); // file.path = Cloudinary URL
      res.json(uploadedFiles);
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ error: "Failed to upload files" });
    }
  };
  
  module.exports = { uploadImages };
  