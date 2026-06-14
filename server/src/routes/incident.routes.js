const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/authorize.middleware");
const getDispatchers = require("../controllers/user.controller").getDispatchers;
const assignIncident = require("../controllers/incident.controller").assignIncident;


const {
  getAllIncidents,
  getIncidentById,
  getIncidentHistory,
  createIncident,
  createIncidentFromAI,
  updateIncidentStatus,
  getCompletedIncidents,
  getIncidentStats,
} = require("../controllers/incident.controller");

router.get("/", authenticate, getAllIncidents);
router.get("/completed",authenticate,getCompletedIncidents);
router.get("/dispatchers", getDispatchers);
router.get("/:id/history", authenticate, getIncidentHistory);
router.patch("/:id/assign", authenticate, authorize("ADMIN", "DISPATCHER"), assignIncident);
router.get("/stats", authenticate, getIncidentStats);
router.get("/:id", authenticate, getIncidentById);
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "DISPATCHER"),
  createIncident
);

router.post(
  "/from-ai",
  authenticate,
  authorize("ADMIN", "DISPATCHER", "OPERATOR"),
  createIncidentFromAI
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "DISPATCHER"),
  updateIncidentStatus
);

module.exports = router;