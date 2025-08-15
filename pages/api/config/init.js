// pages/api/config/init.js
import dbConnect from "@/lib/mongodb";
import AppConfig from "@/models/AppConfig";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await dbConnect();

  const defaults = {
    inactivityDays: 7,
    reactivationBonus: 10,
    prizeThreshold: 20,
    popupTriggerGap: 5,
  };

  try {
    const config = await AppConfig.findOneAndUpdate(
      {},
      { $setOnInsert: defaults },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Config initialized successfully",
      config,
    });
  } catch (err) {
    console.error("Error initializing config:", err);
    return res.status(500).json({ error: "Config init failed" });
  }
}
