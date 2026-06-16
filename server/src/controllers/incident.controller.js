const prisma = require("../config/prisma");
const { analyzeTranscript } = require("../services/ai.service");
const { geocodeLocation } = require("../services/geocoding.service");
const { getIO } = require("../socket");


/**  GET /api/incidents */

const getAllIncidents = async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      where:{
        status: {
          not:"CLOSED"
        }
      },
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
      latitude,
      longitude,
    } = req.body;

    if (!title || !emergencyType) {
      return res.status(400).json({
        message: "Title and emergencyType are required",
      });
    }
    console.log("Received latitude:", req.body.latitude);
console.log("Received longitude:", req.body.longitude);

    const incident = await prisma.incident.create({
  data: {
    title,
    description,
    emergencyType,
    priority,
    location,
    aiConfidence,
    latitude: latitude ? Number(latitude) : null,
    longitude: longitude ? Number(longitude) : null,
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
    const coordinates = await geocodeLocation(aiResult.location);
    // Save incident
  const incident = await prisma.incident.create({
  data: {
    title: aiResult.title,
    description: aiResult.summary,
    emergencyType: aiResult.emergencyType,
    priority: aiResult.priority,
    location: aiResult.location,

    latitude: coordinates.latitude,
    longitude: coordinates.longitude,

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
  include: {
    assignedTo: {
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    },
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
const getIncidentHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await prisma.incidentHistory.findMany({
      where: {
        incidentId: Number(id),
      },
      orderBy: {
        changedAt: "asc",
      },
    });

    return res.json(history);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch incident history",
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
      "EN_ROUTE",
      "ON_SCENE",
      "RESOLVED",
      "CLOSED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // Get current incident
    const existingIncident = await prisma.incident.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existingIncident) {
      return res.status(404).json({
        message: "Incident not found",
      });
    }

    // Allowed workflow
    const validTransitions = {
      NEW: ["REVIEW"],
      REVIEW: ["ASSIGNED"],
      ASSIGNED: ["EN_ROUTE"],
      EN_ROUTE: ["ON_SCENE"],
      ON_SCENE: ["RESOLVED"],
      RESOLVED: ["CLOSED"],
      CLOSED: [],
    };

    const allowedNext =
      validTransitions[existingIncident.status] || [];

    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${existingIncident.status} to ${status}`,
      });
    }

    // Update incident
    const incident = await prisma.incident.update({
      where: {
        id: Number(id),
      },
      data: {
        status,
      },
    });

    // Save history
    await prisma.incidentHistory.create({
      data: {
        incidentId: incident.id,
        oldStatus: existingIncident.status,
        newStatus: status,
      },
    });

    // Notify connected clients
    getIO().emit("incident-updated", incident);

    return res.json(incident);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update incident status",
    });
  }
};

const getCompletedIncidents = async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      where: {
        status: "CLOSED",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return res.json(incidents);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch completed incidents",
    });
  }
};

const assignIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const incident = await prisma.incident.update({
      where: {
        id: Number(id),
      },
      data: {
        assignedToId: Number(userId),
        status: "ASSIGNED",
      },
      include: {
        assignedTo: true,
      },
    });

    await prisma.incidentHistory.create({
      data: {
        incidentId: incident.id,
        oldStatus: "REVIEW",
        newStatus: "ASSIGNED",
      },
    });

    getIO().emit("incident-updated", incident);

    return res.json(incident);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to assign incident",
    });
  }
};

const getIncidentStats = async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany();

    const stats = {
      total: incidents.length,

      active: incidents.filter(
        (i) => i.status !== "CLOSED"
      ).length,

      closed: incidents.filter(
        (i) => i.status === "CLOSED"
      ).length,

      low: incidents.filter((i) => i.priority === "LOW").length,
      medium: incidents.filter((i) => i.priority === "MEDIUM").length,
      high: incidents.filter((i) => i.priority === "HIGH").length,
      critical: incidents.filter((i) => i.priority === "CRITICAL").length,

      medical: incidents.filter((i) => i.emergencyType === "Medical").length,
      fire: incidents.filter((i) => i.emergencyType === "Fire").length,
      crime: incidents.filter((i) => i.emergencyType === "Crime").length,
      accident: incidents.filter((i) => i.emergencyType === "Accident").length,
      rescue: incidents.filter((i) => i.emergencyType === "Rescue").length,
      hazardous: incidents.filter(
        (i) => i.emergencyType === "Hazardous Material"
      ).length,
      disaster: incidents.filter(
        (i) => i.emergencyType === "Natural Disaster"
      ).length,
      domestic: incidents.filter(
        (i) => i.emergencyType === "Domestic Violence"
      ).length,
      infrastructure: incidents.filter(
        (i) => i.emergencyType === "Infrastructure Failure"
      ).length,
      other: incidents.filter((i) => i.emergencyType === "Other").length,

      averageAiConfidence:
        incidents.length === 0
          ? 0
          : incidents.reduce(
              (sum, item) => sum + (item.aiConfidence || 0),
              0
            ) / incidents.length,
    };
    // Incidents grouped by date
const incidentsByDateMap = {};

incidents.forEach((incident) => {
  const date = new Date(incident.createdAt).toLocaleDateString("en-CA");
  incidentsByDateMap[date] = (incidentsByDateMap[date] || 0) + 1;
});

stats.incidentsOverTime = Object.entries(incidentsByDateMap).map(
  ([date, count]) => ({
    date,
    count,
  })
);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to load analytics",
    });
  }
};
module.exports = {
  getAllIncidents,
  createIncident,
  createIncidentFromAI,
  getIncidentById,
  getIncidentStats,
  updateIncidentStatus,
  getIncidentHistory,
  getCompletedIncidents,
  assignIncident,
};