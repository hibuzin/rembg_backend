const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = `outputs/output-${Date.now()}.png`;

  const command = `python python/remove_bg.py ${inputPath} ${outputPath}`;

  exec(command, async (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Background removal failed' });
    }

    // Upload to Cloudinary
    try {
      const result = await cloudinary.uploader.upload(outputPath, {
        folder: 'rembg-outputs'
      });

      res.json({
        message: 'Background removed successfully',
        output: result.secure_url  // Cloudinary URL
      });

    } catch (uploadError) {
      console.error(uploadError);
      res.status(500).json({ error: 'Cloudinary upload failed' });
    }
  });
});

module.exports = router;