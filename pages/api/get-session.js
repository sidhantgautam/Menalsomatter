// /pages/api/get-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: "Session ID required" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["customer"],
    });

    let email =
      session.customer_details?.email ||
      session.customer_email ||
      session.customer?.email ||
      null;

    res.status(200).json({ customer_email: email });
  } catch (err) {
    console.error("Error retrieving session:", err);
    res.status(500).json({ error: "Unable to fetch session" });
  }
}
