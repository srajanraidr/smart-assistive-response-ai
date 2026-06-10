const express = require("express");
const router = express.Router();

const { analyzeCall } = require("../controllers/ai.controller");
const authenticate = require("../middleware/auth.middleware");

router.post("/analyze", authenticate, analyzeCall);

module.exports = router;