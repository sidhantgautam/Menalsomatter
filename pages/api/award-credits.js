// pages/api/award-credits.js

import clientPromise from "../../lib/mongodb"; // if you use MongoDB
// OR import your database connection here if using MySQL/Postgres

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { email, amount } = req.body;
    if (!email || !amount) {
      return res.status(400).json({ error: "Email and amount are required" });
    }

    const client = await clientPromise;
    const db = client.db("raffleDB");


    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newCredits = (user.credits || 0) + amount;

    // Update credits
    await db.collection("users").updateOne(
      { email },
      { $set: { credits: newCredits } }
    );

    res.status(200).json({
      message: `${amount} credits awarded successfully`,
      newCredits,
    });
  } catch (err) {
    console.error("Error awarding credits:", err);
    res.status(500).json({ error: "Failed to award credits" });
  }
}
