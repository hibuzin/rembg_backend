const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    plan: { type: String, default: "free" },
    planExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);