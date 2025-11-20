const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");

async function generateRequestPDF(request) {
  try {
    const approvals = request.approvalChain || [];

    const populated = [];
    for (const step of approvals) {
      const u = await User.findById(step.approver).select("name sign role");
      populated.push({
        ...step.toObject ? step.toObject() : step,
        approverName: u ? u.name : "Unknown",
        signaturePath: u ? u.sign : null
      });
    }

    
    const outDir = path.join(process.cwd(), "public", "approvals");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const filePath = path.join(outDir, `${request.requestId}.pdf`);

    const doc = new PDFDocument({ margin: 40 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).text("Event Request Approval Document", { align: "center" });
    doc.moveDown(1);

    doc.fontSize(12).text(`Request ID: ${request.requestId}`);
    doc.text(`Committee: ${request.committee}`);
    doc.text(`Event Name: ${request.eventName}`);
    doc.text(`Event Date: ${new Date(request.eventDate).toLocaleDateString()}`);
    doc.text(`Start Time: ${request.startTime}   End Time: ${request.endTime}`);
    doc.text(`Venue: ${request.venue}`);
    doc.text(`Expected Attendance: ${request.expectedAttendance}`);
    doc.moveDown(0.5);
    doc.text("Description:");
    doc.text(request.description || "—");
    doc.moveDown(1);

    doc.fontSize(14).text("Approval Timeline");
    doc.moveDown(0.5);

    for (const step of populated) {
      doc.fontSize(12).text(`${step.role}: ${step.approverName}`);
      doc.text(`Status: ${step.status}`);
      doc.text(`Comment: ${step.comment || "—"}`);
      doc.text(`Timestamp: ${step.timestamp ? new Date(step.timestamp).toLocaleString() : "Pending"}`);
      
      if (step.signaturePath && fs.existsSync(step.signaturePath)) {
        try {
          doc.moveDown(0.2);
          doc.image(step.signaturePath, { width: 120 });
          doc.moveDown(0.5);
        } catch (err) {
          doc.text("Signature image failed to render");
        }
      } else {
        doc.text("Signature: [Not available]");
      }
      doc.moveDown(0.8);
    }

    doc.end();

    return await new Promise((resolve, reject) => {
      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    });

  } catch (err) {
    console.error("PDF gen error:", err);
    throw err;
  }
}

module.exports = generateRequestPDF;
