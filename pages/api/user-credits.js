// pages/api/user-credits.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import AppConfig from "@/models/AppConfig";

export default async function handler(req, res) {
  await dbConnect();

  const email = req.query.email;
  if (!email) {
    console.warn("[user-credits] No email provided in query");
    return res.status(400).json({ error: "Email required" });
  }

  console.log("[user-credits] Fetching credits for email:", email);

  const user = await User.findOne({ email });
  if (!user) {
    console.warn("[user-credits] No user found for email:", email);
    return res.status(404).json({ credits: 0 });
  }

  const config = await AppConfig.findOne({ key: "global" });
  if (!config) {
    console.error("[user-credits] Missing AppConfig in DB");
    return res.status(500).json({ error: "App config missing" });
  }

  console.log("[user-credits] Returning data for:", email, {
    credits: user.credits,
    prizeThreshold: config.prizeThreshold,
    popupTriggerGap: config.popupTriggerGap,
  });

  res.status(200).json({
    credits: user.credits,
    prizeThreshold: config.prizeThreshold,
    popupTriggerGap: config.popupTriggerGap,
  });
}
