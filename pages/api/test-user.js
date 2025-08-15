//pages/api/test-user.js
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { email } = req.body;
    const user = await User.create({ email });
    return res.status(201).json(user);
  }

  if (req.method === "GET") {
    const users = await User.find({});
    return res.status(200).json(users);
  }

  res.status(405).end();
}
