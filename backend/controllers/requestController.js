const Request = require("../models/Request");
const User = require("../models/User");
const Venue = require("../models/Venue");
const {bookVenueAndRejectConflicts, timeOverlap} = require("../utils/venueHelper");
const {createCalendarEventForRequest} = require("../utils/calendarHelper");
const generateRequestPDF = require("../utils/requestPdfGenerator");
const {sendEmail} = require("../utils/emailService");


async function buildApprovalChainForCommittee(committee) {
  const chair = await User.findOne({ role: { $in: ["Lead", "Chairperson"] }, committee });
  const faculty = await User.findOne({ role: "Faculty Coordinator", committee });
  const tpo = await User.findOne({ role: "TPO" });
  const vp = await User.findOne({ role: "Vice Principal" });
  const principal = await User.findOne({ role: "Principal" });

  const missing = [];
  if (!chair) missing.push("Chairperson/Lead");
  if (!faculty) missing.push("Faculty Coordinator");
  if (!tpo) missing.push("TPO");
  if (!vp) missing.push("Vice Principal");
  if (!principal) missing.push("Principal");
  if (missing.length) throw new Error("Missing approvers: " + missing.join(", "));

  return [
    { approver: chair._id, role: chair.role === "Lead" ? "Lead" : "Chairperson", status: "approved", comment: "Auto-approved", timestamp: new Date() },
    { approver: faculty._id, role: "Faculty Coordinator", status: "pending" },
    { approver: tpo._id, role: "TPO", status: "pending" },
    { approver: vp._id, role: "Vice Principal", status: "pending" },
    { approver: principal._id, role: "Principal", status: "pending" }
  ];
}

async function resolveNextApprover(request) {
  const nextInfo = request.getNextApprover ? request.getNextApprover() : null;
  if (!nextInfo) return null;
  const approver = await User.findById(nextInfo.approver).select("name role email committee");
  if (!approver) return null;
  return { _id: approver._id, name: approver.name, role: approver.role, email: approver.email };
}


exports.createRequest = async (req, res) => {
  try {
    const user = req.user;
    const {
      committee,
      eventName,
      description,
      eventDate, 
      startTime,
      endTime,
      venue,
      expectedAttendance,
      specialRequirements
    } = req.body;

    
    if (!committee || !eventName || !eventDate || !startTime || !endTime || !venue) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const evDate = new Date(eventDate);
    if (isNaN(evDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid eventDate" });
    }

    
    const approvalChain = await buildApprovalChainForCommittee(committee);

    
    const firstPendingIndex = approvalChain.findIndex(s => s.status === "pending");
    const firstPending = approvalChain[firstPendingIndex];

    const newRequest = await Request.create({
      userId: user._id,
      committee,
      eventName,
      description,
      eventDate: evDate,
      startTime,
      endTime,
      venue,
      expectedAttendance: expectedAttendance || 0,
      specialRequirements: specialRequirements || "",
      approvalChain,
      currentApprover: firstPending ? firstPending.approver : null,
      currentApproverIndex: firstPendingIndex >= 0 ? firstPendingIndex : null,
      status: firstPending ? "pending" : "in-review"
    });

    
    const nextApprover = await resolveNextApprover(newRequest);

    
    if (nextApprover && nextApprover.email) {
      sendEmail({
        to: nextApprover.email,
        subject: `Request ${newRequest.requestId} awaiting your approval`,
        text: `Please review request ${newRequest.requestId}`
      });
    }

    return res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      data: { request: newRequest, nextApprover }
    });

  } catch (err) {
    console.error("createRequest err:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


exports.approveRequest = async (req, res) => {
  try {
    const user = req.user;
    const { requestId } = req.params;
    const { comment } = req.body;

    const r = await Request.findById(requestId);
    if (!r) return res.status(404).json({ success: false, message: "Request not found" });

    
    if (!r.currentApprover || r.currentApprover.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not the current approver" });
    }

    const idx = r.currentApproverIndex;
    r.approvalChain[idx].status = "approved";
    r.approvalChain[idx].comment = comment || "";
    r.approvalChain[idx].timestamp = new Date();

    
    const nextIndex = r.approvalChain.findIndex(s => s.status === "pending");
    if (nextIndex !== -1) {
      r.currentApprover = r.approvalChain[nextIndex].approver;
      r.currentApproverIndex = nextIndex;
      r.status = "in-review";
      await r.save();

      
      const nextUser = await User.findById(r.currentApprover);
      
      if (nextUser && nextUser.email) {
        sendEmail({ to: nextUser.email, subject: `Request ${r.requestId} awaiting your approval`, text: `Please review.` });
      }
      
      const student = await User.findById(r.userId);
      
      if (student && student.email) {
        sendEmail({ to: student.email, subject: `Request ${r.requestId} moved to ${r.approvalChain[nextIndex].role}`, text: `Your request moved forward.` });
      }

      const nextApprover = await resolveNextApprover(r);
      return res.json({ success: true, message: "Step approved and forwarded", data: { request: r, nextApprover } });
    } else {
        
      r.currentApprover = null;
      r.currentApproverIndex = null;
      r.status = "approved";
      r.approvedAt = new Date();

      await r.save();

      
      await bookVenueAndRejectConflicts(r.venue, r.eventDate, r.startTime, r.endTime, r._id);

      
      await createCalendarEventForRequest(r);

      
      const pdfPath = await generateRequestPDF(r);

      
      const student = await User.findById(r.userId);
      if (student && student.email) {
        sendEmail({ to: student.email, subject: `Request ${r.requestId} approved`, text: `Your request approved. Download: ${pdfPath}` });
      }

      
      const globalApprovers = await User.find({ role: { $in: ["TPO", "Vice Principal", "Principal"] } });
      for (const ga of globalApprovers) {
        if (ga.email) sendEmail({ to: ga.email, subject: `Request ${r.requestId} approved`, text: `Request approved.` });
      }

      return res.json({ success: true, message: "Request fully approved", data: { request: r, pdfPath } });
    }

  } catch (err) {
    console.error("approveRequest err:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


exports.rejectRequest = async (req, res) => {
  try {
    const user = req.user;
    const { requestId } = req.params;
    const { reason, comment } = req.body;

    if (!reason) return res.status(400).json({ success: false, message: "reason required" });

    const r = await Request.findById(requestId);
    if (!r) return res.status(404).json({ success: false, message: "Request not found" });

    if (!r.currentApprover || r.currentApprover.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not the current approver" });
    }

    const idx = r.currentApproverIndex;
    r.approvalChain[idx].status = "rejected";
    r.approvalChain[idx].comment = comment || "";
    r.approvalChain[idx].timestamp = new Date();

    r.status = "rejected";
    r.rejectionReason = reason;
    r.rejectedBy = user._id;
    r.rejectedAt = new Date();
    r.currentApprover = null;
    r.currentApproverIndex = null;

    await r.save();

    const student = await User.findById(r.userId);
    if (student && student.email) {
      sendEmail({ to: student.email, subject: `Request ${r.requestId} rejected`, text: `Reason: ${reason}` });
    }

    return res.json({ success: true, message: "Request rejected", data: r });

  } catch (err) {
    console.error("rejectRequest err:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


exports.downloadPDF = async (req, res) => {
  try {
    const user = req.user;
    const { requestId } = req.params;
    const r = await Request.findById(requestId);
    if (!r) return res.status(404).json({ success: false, message: "Request not found" });
    if (r.status !== "approved") return res.status(400).json({ success: false, message: "PDF available only after approval" });

    
    const allowedRoles = ["TPO", "Vice Principal", "Principal"];
    const isGlobalApprover = allowedRoles.includes(user.role);
    const isStudent = r.userId.toString() === user._id.toString();
    const isSameCommittee = user.committee && user.committee === r.committee;

    if (!(isGlobalApprover || isStudent || isSameCommittee)) {
      return res.status(403).json({ success: false, message: "You are not authorized to download this PDF" });
    }

    
    const pdfPath = require("path").join(process.cwd(), "public", "approvals", `${r.requestId}.pdf`);
    if (!require("fs").existsSync(pdfPath)) {
      return res.status(404).json({ success: false, message: "PDF not found" });
    }

    res.download(pdfPath, `${r.requestId}.pdf`);
  } catch (err) {
    console.error("downloadPDF err:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};


exports.fetchRequests = async (req, res) => {
  try {
    const user = req.user;
    const { month, status, userId } = req.query;
    const q = {};

    
    if (status) {
      if (status === "pending") q.status = { $in: ["pending", "in-review"] };
      else if (status === "complete") q.status = { $in: ["approved", "rejected"] };
      else q.status = status;
    }

    
    if (req.path.endsWith("/me")) {
      q.userId = user._id;
    } else if (userId) {
      q.userId = userId;
    }

    if (month) {
      const [y, m] = month.split("-").map(Number);
      const start = new Date(y, m - 1, 1, 0, 0, 0);
      const end = new Date(y, m - 1 + 1, 1, 0, 0, 0);
      q.eventDate = { $gte: start, $lt: end };
    }

    if (["Lead", "Chairperson", "Faculty Coordinator"].includes(user.role)) {
      q.committee = user.committee;
    } else if (["TPO", "Vice Principal", "Principal"].includes(user.role)) {
    } else if (user.role === "Student") {
      if (!userId) q.userId = user._id;
    }

    const requests = await Request.find(q).sort({ createdAt: -1 }).lean();

    const enriched = await Promise.all(requests.map(async r => {
      const rr = r;
      const pendingIdx = rr.approvalChain.findIndex(s => s.status === "pending");
      rr.nextApprover = null;
      if (pendingIdx !== -1) {
        const ap = rr.approvalChain[pendingIdx];
        const userDoc = await User.findById(ap.approver).select("name role");
        rr.nextApprover = userDoc ? { _id: userDoc._id, name: userDoc.name, role: userDoc.role } : null;
      }
      rr.downloadAvailable = rr.status === "approved";
      const venueDoc = await Venue.findOne({ name: rr.venue });
      rr.venueBooked = false;
      if (venueDoc) {
        rr.venueBooked = venueDoc.bookedSlots.some(bs => {
          const sameDate = new Date(bs.eventDate).toDateString() === new Date(rr.eventDate).toDateString();
          if (!sameDate) return false;
          return timeOverlap(bs.startTime, bs.endTime, rr.startTime, rr.endTime);
        });
      }
      return rr;
    }));

    return res.json({ success: true, data: enriched });
  } catch (err) {
    console.error("fetchRequests err:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

exports.getCalendarOverview = async (req, res) => {
  try {
    const { month } = req.params; // Format: YYYY-MM

    const start = new Date(`${month}-01`);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

    const events = await Request.find({
      eventDate: { $gte: start, $lt: end },
      status: "approved" // Only show approved events on calendar
    });

    const eventDates = events.map(e =>
      e.eventDate.toISOString().split("T")[0]
    );

    const uniqueDates = [...new Set(eventDates)];

    res.json({
      success: true,
      month,
      event_on: uniqueDates
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/requests/getCalendar/:month/:day
exports.getEventsByDay = async (req, res) => {
    try {
        const { month, date } = req.params; // MUST BE 'date'

        console.log("Received month:", month, "date:", date);

        if (!month || !date) {
            return res.status(400).json({ error: "Month or date missing" });
        }

        const fullDate = `${month}-${String(date).padStart(2, "0")}`;

        const parsedDate = new Date(fullDate);

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        // Create day's time range
        const startDate = new Date(`${fullDate}T00:00:00.000Z`);
        const endDate = new Date(`${fullDate}T23:59:59.999Z`);

        const events = await Request.find({
            eventDate: { $gte: startDate, $lte: endDate }
        });

        return res.json({
            success: true,
            date: fullDate,
            count: events.length,
            events
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};
