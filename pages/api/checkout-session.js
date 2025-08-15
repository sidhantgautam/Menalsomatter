// /pages/api/checkout-session.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: "session_id required" });

  const session = await stripe.checkout.sessions.retrieve(session_id);
  res.json({ customer_email: session.customer_email });
}
