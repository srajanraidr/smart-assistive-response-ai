const prisma = require("../config/prisma");
const { analyzeTranscript } = require("../services/ai.service");
const { getIO } = require("../socket");

/**
 * GET /api/incidents
 */
const getAllIncidents = async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(incidents);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch incidents",
    });
  }
};

/**
 * POST /api/incidents
 */
const createIncident = async (req, res) => {
  try {
    const {
      title,
      description,
      emergencyType,
      priority,
      location,
      aiConfidence,
    } = req.body;

    if (!title || !emergencyType) {
      return res.status(400).json({
        message: "Title and emergencyType are required",
      });
    }

    const incident = await prisma.incident.create({
      data: {
        title,
        description,
        emergencyType,
        priority,
        location,
        aiConfidence,
      },
    });

    // Broadcast to all dashboards
    getIO().emit("new-incident", incident);

    return res.status(201).json(incident);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create incident",
    });
  }
};

/**
 * POST /api/incidents/from-ai
 */
const createIncidentFromAI = async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        message: "Transcript is required",
      });
    }

    // Analyze transcript using Gemini
    const aiResult = await analyzeTranscript(transcript);

    // Save incident
    const incident = await prisma.incident.create({
  data: {
    title: aiResult.title,
    description: aiResult.summary,
    emergencyType: aiResult.emergencyType,
    priority: aiResult.priority,
    location: aiResult.location,
    aiConfidence: aiResult.aiConfidence,
    recommendedDepartment: aiResult.recommendedDepartment,
    riskLevel: aiResult.riskLevel,
    keywords: aiResult.keywords,
    requiresHumanReview: aiResult.requiresHumanReview,
  },
});

    // Broadcast to all connected dashboards
    getIO().emit("new-incident", incident);

    return res.status(201).json({
      message: "Incident created successfully",
      incident,
      aiAnalysis: aiResult,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create incident",
    });
  }
};

/**
 * GET /api/incidents/:id
 */
const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await prisma.incident.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!incident) {
      return res.status(404).json({
        message: "Incident not found",
      });
    }

    return res.json(incident);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch incident",
    });
  }
};

/**
 * PATCH /api/incidents/:id/status
 */
const updateIncidentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "NEW",
      "REVIEW",
      "ASSIGNED",
      "RESOLVED",
      "CLOSED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const incident = await prisma.incident.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
      },
    });

    // Broadcast updated incident
    getIO().emit("incident-updated", incident);

    return res.json(incident);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update incident status",
    });
  }
};

module.exports = {
  getAllIncidents,
  createIncident,
  createIncidentFromAI,
  getIncidentById,
  updateIncidentStatus,
};