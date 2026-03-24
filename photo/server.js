require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');


const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/outputs', express.static('outputs'));


app.use("/api/auth", require("./routes/auth"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/webhook", require("./routes/webhook"))

require("./cron/expiryJob");

const removeBgRoute = require('./routes/removeBg');
app.use('/api/remove-bg', removeBgRoute);

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rembg:tokyodel9600@cluster0.mf5mqpq.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('mongoDB Connected'))
  .catch(err => console.error('mongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('API running');
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
