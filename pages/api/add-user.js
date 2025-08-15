//pages/api/add-user.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.create({ email });

    return res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
