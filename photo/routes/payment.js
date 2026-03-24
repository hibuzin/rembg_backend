const express = require("express");
const router = express.Router();
const Plan = require("../models/plan");
const stripe = require("../utils/stripe");
const auth = require("../middleware/auth");

router.post("/create-session", auth, async (req, res) => {
    const plan = await Plan.findOne({ name: req.body.planName });

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: plan.stripePriceId, quantity: 1 }],
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
        metadata: {
            userId: req.user.id,
            planName: plan.name
        }
    });

    res.json({ url: session.url });
});

module.exports = router;