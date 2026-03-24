const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    items: Array,
    totalAmount: Number
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);