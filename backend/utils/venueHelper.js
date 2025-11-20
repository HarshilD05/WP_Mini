const Venue = require("../models/Venue");
const Request = require("../models/Request");

function timeOverlap(startA, endA, startB, endB) {
  const toMinutes = t => {
    const [hh, mm] = t.split(":").map(Number);
    return hh * 60 + mm;
  };
  const a1 = toMinutes(startA), a2 = toMinutes(endA);
  const b1 = toMinutes(startB), b2 = toMinutes(endB);
  return Math.max(a1, b1) < Math.min(a2, b2);
}

async function bookVenueAndRejectConflicts(venueName, eventDate, startTime, endTime, requestId) {

  let venue = await Venue.findOne({ name: venueName });
  if (!venue) {
    venue = await Venue.create({ name: venueName, bookedSlots: [] });
  }

  venue.bookedSlots.push({ requestId, eventDate, startTime, endTime });
  await venue.save();

  const startOfDay = new Date(eventDate);
  startOfDay.setHours(0,0,0,0);
  const endOfDay = new Date(eventDate);
  endOfDay.setHours(23,59,59,999);

  const others = await Request.find({
    _id: { $ne: requestId },
    venue: venueName,
    eventDate: { $gte: startOfDay, $lte: endOfDay },
    status: { $in: ["pending", "in-review"] }
  });

  for (const r of others) {
    // if time overlap
    if (timeOverlap(r.startTime, r.endTime, startTime, endTime)) {
      r.status = "rejected";
      r.rejectionReason = "Venue already booked";
      r.rejectedAt = new Date();
      await r.save();
      // You may want to notify the student here (email)
    }
  }
}

module.exports = { bookVenueAndRejectConflicts, timeOverlap };
