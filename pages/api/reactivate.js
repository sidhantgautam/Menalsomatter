// pages/api/reactivate.ks
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import AppConfig from "@/models/AppConfig";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  await dbConnect();

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const config = await AppConfig.findOne({ key: "global" });
  if (!config) return res.status(500).json({ error: "App config missing" });

  const now = new Date();
  const inactivityLimit = new Date(now);
  inactivityLimit.setDate(now.getDate() - config.inactivityDays);

  if (user.status === "inactive" && user.lastActive < inactivityLimit) {
    user.credits = (user.credits || 0) + config.reactivationBonus;

    user.creditHistory.push({
      type: "reactivation_bonus",
      amount: config.reactivationBonus,
      date: now,
    });

    user.status = "active";
    user.lastActive = now;
    user.hasReactivated = true;

    user.notifications.forEach((n) => {
      if (n.type === "nudge" && !n.seen) n.seen = true;
    });

    await user.save();

    return res.status(200).json({
      message: `Reactivated! +${config.reactivationBonus} credits awarded.`,
      credits: user.credits,
      status: user.status,
      lastActive: user.lastActive,
      hasReactivated: user.hasReactivated,
    });
  }

  return res.status(400).json({
    error: "User not eligible for reactivation bonus",
    credits: user.credits,
    status: user.status,
    lastActive: user.lastActive,
    hasReactivated: user.hasReactivated,
  });
}
