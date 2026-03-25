const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch'); 

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — no disk folder needed on Render
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB is enough for remove.bg
});

router.get('/', (req, res) => res.send('Remove BG API working'));

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    // Call remove.bg API
    const form = new FormData();
    form.append('image_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    form.append('size', 'auto');

    const rbgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': process.env.REMOVE_BG_API_KEY, ...form.getHeaders() },
      body: form,
    });

    if (!rbgRes.ok) {
      const err = await rbgRes.json();
      return res.status(500).json({ error: 'remove.bg failed', detail: err });
    }

    const buffer = await rbgRes.buffer();

    // Upload result to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'rembg-outputs' },
        (err, result) => (err ? reject(err) : resolve(result))
      ).end(buffer);
    });

    res.json({ message: 'Background removed successfully', output: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Background removal failed' });
  }
});

module.exports = router;