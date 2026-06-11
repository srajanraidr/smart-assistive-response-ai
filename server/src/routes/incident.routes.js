const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth.middleware");

const {
  getAllIncidents,
  createIncident,
  createIncidentFromAI,
  getIncidentById,
  updateIncidentStatus
} = require("../controllers/incident.controller");

router.get("/", authenticate, getAllIncidents);
router.get("/:id",authenticate,getIncidentById);

router.post("/", authenticate, createIncident);
router.patch("/:id/status",authenticate,updateIncidentStatus);

// New endpoint
router.post("/from-ai", authenticate, createIncidentFromAI);

module.exports = router;