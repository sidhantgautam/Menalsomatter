//models/User.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  type: { type: String },
  message: { type: String },
  cta: { type: String },
  seen: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  credits: { type: Number, default: 0 },
  creditHistory: [
    {
      type: { type: String },
      amount: Number,
      date: { type: Date, default: Date.now },
    },
  ],
  processedSessions: { type: [String], default: [] },
  lastActive: { type: Date, default: Date.now },
  lastNudge: { type: Date, default: null },
  hasReactivated: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["active", "inactive", "deactivated"],
    default: "active",
  },
  notifications: { type: [NotificationSchema], default: [] },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
