// pages/api/check-inactive-users.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

const INACTIVITY_DAYS = 7;
const REACTIVATION_BONUS = 10;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  await dbConnect();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - INACTIVITY_DAYS);

  const inactiveUsers = await User.find({
    lastActive: { $lt: cutoffDate },
  });

  const updates = await Promise.all(
    inactiveUsers.map(async (user) => {
      const alreadyNudged =
        user.lastNudge && user.lastNudge > cutoffDate;

      if (!alreadyNudged) {
        user.notifications.push({
          type: "nudge",
          message: `We miss you! Reactivate now and earn +${REACTIVATION_BONUS} bonus credits.`,
          cta: "/api/reactivate?email=" + user.email,
        });
        user.lastNudge = new Date();
        await user.save();
      }
      return user;
    })
  );

  return res.status(200).json({
    message: "Nudges processed",
    count: updates.length,
  });
}
