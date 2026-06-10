const prisma = require("../config/prisma");

const getAllIncidents = async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(incidents);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch incidents",
    });
  }
};

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

    res.status(201).json(incident);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create incident",
    });
  }
};

module.exports = {
  getAllIncidents,
  createIncident,
};