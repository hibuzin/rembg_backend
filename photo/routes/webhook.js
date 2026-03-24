const express = require("express");
const router = express.Router();
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


router.post(
    "/",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } catch (err) {
            console.error("Webhook signature error:", err.message);
            return res.status(400).json({ message: `Webhook Error: ${err.message}` });
        }

        
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                console.log(" Payment succeeded:", paymentIntent.id);
                
                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                console.log(" Payment failed:", paymentIntent.id);
                
                break;
            }

            case "customer.subscription.created": {
                const subscription = event.data.object;
                console.log("📦 Subscription created:", subscription.id);
               
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                console.log("🗑️ Subscription cancelled:", subscription.id);
                // TODO: revoke access in DB
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    }
);

module.exports = router;