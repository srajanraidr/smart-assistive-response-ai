const { analyzeTranscript } = require("../services/ai.service");

const analyzeCall = async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({
        message: "Transcript is required",
      });
    }

    const aiResult = await analyzeTranscript(transcript);

    return res.status(200).json(aiResult);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "AI analysis failed",
    });
  }
};

module.exports = {
  analyzeCall,
};