import { Requests } from "../models/Requests.models.js";
import cron from "node-cron";
// Runs every hour 
cron.schedule("0 * * * *", async () => {
    console.log("Running expiry check...");

    const now = new Date();
    const result = await Requests.updateMany(
        { 
            expirydate: { $lt: now }, status: "pending" 
        },
        { 
            status: "expired" 
        }
    );

    console.log(`Marked ${result.modifiedCount} requests as expired.`);
});
