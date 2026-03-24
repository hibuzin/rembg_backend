const cron = require("node-cron");
const User = require("../models/user");

cron.schedule("0 0 * * *", async () => {
    const users = await User.find({
        planExpiry: { $lt: new Date() }
    });

    for (let user of users) {
        user.plan = "free";
        await user.save();
    }
});