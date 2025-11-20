const mongoose = require("mongoose");

const bookedSlotSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: "Request" },
  eventDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
}, { _id: false });

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String },
  capacity: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  bookedSlots: { type: [bookedSlotSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("Venue", venueSchema);
