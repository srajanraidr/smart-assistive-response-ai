import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Analyze() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      alert("Please enter a transcript.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/incidents/from-ai", {
        transcript,
      });

      alert("Incident created successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to analyze transcript.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Analyze Emergency Transcript</h1>

      <textarea
        rows={10}
        cols={80}
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste emergency transcript here..."
      />

      <br />
      <br />

      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze & Create Incident"}
      </button>
    </div>
  );
}