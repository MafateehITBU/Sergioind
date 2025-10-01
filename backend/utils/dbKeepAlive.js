import cron from "node-cron";
import Category from "../models/Category.js";

export const keepDbAlive = () => {
  // Run every 10 days at midnight
  cron.schedule(
    "0 0 */10 * *",
    async () => {
      try {
        console.log("Running MongoDB keep-alive cron...");

        const category = await Category.findOne();
        if (category) {
          console.log("Keep-alive: Found a category, DB is active.");
        } else {
          console.log("Keep-alive: No categories found, DB is active.");
        }
      } catch (error) {
        console.error("Keep-alive cron error:", error.message);
      }
    },
    {
      scheduled: true,
    }
  );
};
