const CalendarEvent = require("../models/CalendarEvent");

async function createCalendarEventForRequest(request) {
  const ev = await CalendarEvent.create({
    requestId: request._id,
    eventName: request.eventName,
    committee: request.committee,
    venue: request.venue,
    eventDate: request.eventDate,
    startTime: request.startTime,
    endTime: request.endTime,
    status: "approved"
  });
  return ev;
}

module.exports = { createCalendarEventForRequest };
