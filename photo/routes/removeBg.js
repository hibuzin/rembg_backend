const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const cloudinary = require('cloudinary').v2;

const router = express.Router();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } 
});


router.get('/', (req, res) => {
  res.send("Remove BG API working");
});


router.post('/', upload.single('image'), (req, res) => {
  console.log("Request received");

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const inputPath = req.file.path;
  const outputPath = `outputs/output-${Date.now()}.png`;

  const command =
    process.platform === "win32"
      ? `python python/remove_bg.py ${inputPath} ${outputPath}`
      : `python3 python/remove_bg.py ${inputPath} ${outputPath}`;

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error("Python error:", error);
      return res.status(500).json({ error: 'Background removal failed' });
    }

    try {
    
      const result = await cloudinary.uploader.upload_large(outputPath, {
        resource_type: "image",
        folder: "rembg-outputs"
      });

      res.json({
        message: 'Background removed successfully',
        output: result.secure_url
      });

    } catch (uploadError) {
      console.error("Cloudinary error:", uploadError);
      res.status(500).json({ error: 'Cloudinary upload failed' });
    }
  });
});

module.exports = router;