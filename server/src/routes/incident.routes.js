const express = require('express');
const router = express.Router();

const {getAllIncidents,createIncident} = require('../controllers/incident.controller');

router.get("/",getAllIncidents);
router.post("/",createIncident);

module.exports = router;