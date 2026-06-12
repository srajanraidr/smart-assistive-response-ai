const prisma = require("../config/prisma");
const { transcribeAudio } = require("../services/transcription.service");
const { analyzeTranscript } = require("../services/ai.service");
const { getIO } = require("../socket");

const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No audio file uploaded",
      });
    }

    // Step 1: Transcribe audio
    const transcriptResult = await transcribeAudio(req.file.path);
    const transcript = transcriptResult.text;

    // Step 2: Analyze with Gemini
    const aiResult = await analyzeTranscript(transcript);

    // Step 3: Save incident
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

    // Step 4: Notify dashboard
    getIO().emit("new-incident", incident);

    return res.status(201).json({
      message: "Incident created from audio successfully",
      transcript,
      aiAnalysis: aiResult,
      incident,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to process audio",
    });
  }
};

module.exports = {
  uploadAudio,
};