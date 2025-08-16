//pages/api/ping-active.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import AppConfig from "@/models/AppConfig";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, awardAmount, sessionId } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  await dbConnect();

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      credits: 0,
      status: "active",
      lastActive: new Date(),
      processedSessions: [],
      creditHistory: [],
      notifications: [],
      hasReactivated: false,
    });
  }

  const config = await AppConfig.findOne({ key: "global" });
  if (!config) return res.status(500).json({ error: "App config missing" });

  const now = new Date();
  const inactivityLimit = new Date(now);
  inactivityLimit.setDate(now.getDate() - config.inactivityDays);

  if (awardAmount && !isNaN(awardAmount)) {
    if (sessionId && user.processedSessions.includes(sessionId)) {
      return res.status(200).json({
        email: user.email,
        status: user.status,
        lastActive: user.lastActive,
        credits: user.credits,
        alreadyAwarded: true,
        notifications: user.notifications,
        hasReactivated: user.hasReactivated,
      });
    }

    user.credits += Number(awardAmount);
    user.creditHistory.push({
      type: "award",
      amount: Number(awardAmount),
      date: now,
    });

    if (sessionId) {
      user.processedSessions.push(sessionId);
    }
  }

  if (user.lastActive < inactivityLimit && user.status === "active") {
    user.status = "inactive";
    user.hasReactivated = false;
    user.notifications.push({
      type: "nudge",
      message: `We miss you! Reactivate now and earn +${config.reactivationBonus} bonus credits.`,
      cta: "/api/reactivate",
      seen: false,
    });
    user.lastNudge = now;
  } else {
    user.lastActive = now;
    if (user.status !== "inactive") {
      user.status = "active";
    }
  }

  await user.save();

  return res.status(200).json({
    email: user.email,
    status: user.status,
    lastActive: user.lastActive,
    credits: user.credits || 0,
    notifications: user.notifications,
    hasReactivated: user.hasReactivated,
  });
}

