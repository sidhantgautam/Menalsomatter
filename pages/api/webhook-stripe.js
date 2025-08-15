// pages/api/webhook-stripe.js
import Stripe from "stripe";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

export default async function handler(req, res) {
  const rawBody = await new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
  });

  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).send("Missing Stripe signature");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_email || "anonymous@example.com";
    const amountInPaise = session.amount_total || 0;
    const creditsToAward = amountInPaise / 100;

    await dbConnect();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, credits: 0, creditHistory: [] });
    }

    user.credits += creditsToAward;
    user.creditHistory.push({
      type: "donation",
      amount: creditsToAward,
    });
    await user.save();

    console.log(`Awarded ${creditsToAward} credits to ${email}. Total: ${user.credits}`);
  }

  res.json({ received: true });
}
