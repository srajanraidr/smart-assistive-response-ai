const { AssemblyAI } = require("assemblyai");

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

async function transcribeAudio(filePath) {
  const transcript = await client.transcripts.transcribe({
    audio: filePath,
  });

  return transcript;
}

module.exports = {
  transcribeAudio,
};