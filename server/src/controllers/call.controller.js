const prisma = require("../config/prisma");
const { transcribeAudio } = require("../services/transcription.service");
const { analyzeTranscript } = require("../services/ai.service");
const { geocodeLocation } = require("../services/geocoding.service");
const { getIO } = require("../socket");

const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No audio file uploaded",
      });
    }console.log("BODY:", req.body);
console.log("Latitude:", req.body.latitude);
console.log("Longitude:", req.body.longitude);

    // Step 1: Transcribe audio
    const transcriptResult = await transcribeAudio(req.file.path);
    const transcript = transcriptResult.text;

    // Step 2: Analyze with AI
    const aiResult = await analyzeTranscript(transcript);

    // Step 3: Use frontend coordinates if provided, otherwise geocode the extracted location
    const bodyLatitude =
      req.body.latitude != null && req.body.latitude !== ""
        ? Number(req.body.latitude)
        : null;
    const bodyLongitude =
      req.body.longitude != null && req.body.longitude !== ""
        ? Number(req.body.longitude)
        : null;

    const coordinates =
      bodyLatitude !== null && bodyLongitude !== null
        ? { latitude: bodyLatitude, longitude: bodyLongitude }
        : await geocodeLocation(aiResult.location);

    // Step 4: Save incident
    const incident = await prisma.incident.create({
      data: {
        title: aiResult.title,
        description: aiResult.summary,
        emergencyType: aiResult.emergencyType,
        priority: aiResult.priority,
        location: aiResult.location,

        // ✅ Save GPS coordinates
        latitude: coordinates?.latitude ?? null,
        longitude: coordinates?.longitude ?? null,

        aiConfidence: aiResult.aiConfidence,
        recommendedDepartment: aiResult.recommendedDepartment,
        riskLevel: aiResult.riskLevel,
        keywords: aiResult.keywords,
        requiresHumanReview: aiResult.requiresHumanReview,
        source: "WEB",
      },
    });

    // Step 5: Notify dashboard
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