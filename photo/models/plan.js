const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: String,
    price: Number,
    duration: Number,
    billLimit: Number
});

module.exports = mongoose.model("Plan", planSchema);