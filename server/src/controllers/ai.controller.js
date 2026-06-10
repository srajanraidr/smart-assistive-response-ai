const prisma = require("../config/prisma");
const { analyzeTranscript } = require("../services/ai.service");

const analyzeCall = async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        message: "Transcript is required",
      });
    }

    // Get AI analysis
    const aiResult = await analyzeTranscript(transcript);

    // Save as Incident
    const incident = await prisma.incident.create({
      data: {
        title: aiResult.title,
        description: aiResult.summary,
        emergencyType: aiResult.emergencyType,
        priority: aiResult.priority,
        location: aiResult.location,
        aiConfidence: aiResult.aiConfidence,
      },
    });

    return res.status(201).json({
      message: "Incident created successfully",
      incident,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "AI processing failed",
    });
  }
};

module.exports = {
  analyzeCall,
};