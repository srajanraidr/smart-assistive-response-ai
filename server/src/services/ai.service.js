const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeTranscript(transcript) {
  const prompt = `
You are an emergency dispatch assistant.

Analyze the following emergency transcript.

Return ONLY valid JSON with this structure:

{
  "emergencyType": "",
  "priority": "",
  "title": "",
  "summary": "",
  "location": "",
  "aiConfidence": 0.0
}

Rules:
- Do not invent facts.
- If information is unavailable, use null.
- priority must be one of: LOW, MEDIUM, HIGH, CRITICAL.

Transcript:
${transcript}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let text = response.text.trim();

  // Remove Markdown code fences if Gemini returns them
  text = text.replace(/^```json\s*/i, "").replace(/```$/, "").trim();

  return JSON.parse(text);
}

module.exports = {
  analyzeTranscript,
};