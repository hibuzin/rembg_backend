const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    plan: String,
    amount: Number,
    paymentId: String,
    orderId: String,
    startDate: Date,
    endDate: Date,
    status: String
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subSchema);