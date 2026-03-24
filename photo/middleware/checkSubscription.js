const User = require("../models/user");
const Order = require("../models/Order");

module.exports = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    // Expiry check
    if (user.plan !== "free" && user.planExpiry < new Date()) {
        user.plan = "free";
        await user.save();
    }

    // Free limit
    if (user.plan === "free") {
        const count = await Order.countDocuments({ userId: user._id });

        if (count >= 10) {
            return res.status(403).json({
                message: "Upgrade plan to continue"
            });
        }
    }

    next();
};