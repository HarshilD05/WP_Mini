const mongoose = require("mongoose");

const approvalStepSchema = new mongoose.Schema({
  approver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["Lead", "Chairperson", "Faculty Coordinator", "TPO", "Vice Principal", "Principal"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  comment: {
    type: String,
    default: "",
  },
  timestamp: {
    type: Date,
    default: null,
  },
}, { _id: false });

const requestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  committee: {
    type: String,
    enum: ["GDG Student Club", "Synapse Club", "ACM Student Chapter"],
    required: true,
  },
  eventName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  specialRequirements: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "in-review", "approved", "rejected"],
    default: "pending",
  },
  approvalChain: {
    type: [approvalStepSchema],
    required: true,
  },
  currentApprover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  currentApproverIndex: {
    type: Number,
    default: 0,
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  rejectedAt: {
    type: Date,
    default: null,
  },
  approvedAt: {
    type: Date,
    default: null,
  }
}, { timestamps: true });

requestSchema.pre("save", async function (next) {
  if (!this.requestId) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments();
    this.requestId = `REQ-${year}-${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

requestSchema.methods.getNextApprover = function () {
  const pendingIndex = this.approvalChain.findIndex(step => step.status === "pending");
  if (pendingIndex === -1) return null;
  const step = this.approvalChain[pendingIndex];
  return { approver: step.approver, role: step.role, index: pendingIndex };
};

module.exports = mongoose.model("Request", requestSchema);
