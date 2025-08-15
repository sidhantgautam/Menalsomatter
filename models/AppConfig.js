// models/AppConfig.js
import mongoose from "mongoose";

const AppConfigSchema = new mongoose.Schema({
  key: { type: String, default: "global", unique: true },
  inactivityDays: { type: Number, default: 7 },
  reactivationBonus: { type: Number, default: 10 },
  prizeThreshold: { type: Number, default: 100 },
  popupTriggerGap: { type: Number, default: 10 },
}, { timestamps: true });

export default mongoose.models.AppConfig || mongoose.model("AppConfig", AppConfigSchema);
