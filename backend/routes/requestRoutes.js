const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.post("/", auth, requestController.createRequest);

router.put("/:requestId/approve", auth, requestController.approveRequest);

router.put("/:requestId/reject", auth, requestController.rejectRequest);

router.get("/:requestId/download", auth, requestController.downloadPDF);

router.get("/me", auth, requestController.fetchRequests);

router.get("/", auth, requestController.fetchRequests);

router.get("/getCalendar/:month", auth, requestController.getCalendarOverview);

router.get("/getCalendar/:month/:date", auth, requestController.getEventsByDay);




module.exports = router;
