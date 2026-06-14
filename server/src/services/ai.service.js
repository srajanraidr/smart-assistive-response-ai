const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeTranscript(transcript) {
  const prompt = `
You are an AI-powered Emergency Dispatch Assistant.

Your role is to analyze emergency call transcripts and extract structured information to assist human dispatchers.

IMPORTANT RULES:
- Return ONLY valid JSON.
- Do NOT include markdown, explanations, or extra text.
- Do NOT fabricate information.
- If a value cannot be determined from the transcript, return null.
- Base your output only on information explicitly stated or strongly implied in the transcript.
- The AI provides recommendations only. Human dispatchers make all operational decisions.

Allowed emergencyType values:
- Medical
- Fire
- Crime
- Accident
- Natural Disaster
- Hazardous Material
- Rescue
- Domestic Violence
- Infrastructure Failure
- Other

Allowed priority values:
- LOW
- MEDIUM
- HIGH
- CRITICAL

Allowed recommendedDepartment values:
- Ambulance
- Fire
- Police
- Hazmat
- Search & Rescue
- Multi-Agency

Allowed riskLevel values:
- Low
- Moderate
- High
- Extreme

Return ONLY this JSON structure:

{
  "emergencyType": "",
  "priority": "",
  "title": "",
  "summary": "",
  "location": null,
  "recommendedDepartment": "",
  "riskLevel": "",
  "keywords": [],
  "aiConfidence": 0.0,
  "requiresHumanReview": true
}

Field rules:
- title: Short incident title (5-10 words).
- summary: One or two factual sentences.
- location: Extract the exact place name, address, landmark, street, city, or intersection explicitly mentioned by the caller.
- Preserve the wording as spoken when possible.
- If no location is mentioned, return null.
- Never invent or guess a location.
- keywords: Return 3-6 short keywords from the transcript.
- aiConfidence: Number between 0.0 and 1.0.
- requiresHumanReview: Always true.

Never invent addresses, names, injuries, or other missing facts.

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