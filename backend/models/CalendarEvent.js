const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true },
  eventName: { type: String, required: true },
  committee: { type: String },
  venue: { type: String },
  eventDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ["pending", "in-review", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("CalendarEvent", calendarSchema);
