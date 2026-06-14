import { useState } from "react";
import api from "../api/axios";
import "../styles/uploadAudio.css";

export default function UploadAudio() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an audio file.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("audio", file);

      const res = await api.post("/calls/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h1>🎤 Upload Emergency Audio</h1>

        <p>
          Upload an emergency recording. SARA will transcribe it,
          analyze it with AI, and create an incident automatically.
        </p>

        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Processing..." : "Upload & Analyze"}
        </button>

        {result && (
          <div className="result-card">
            <h2>✅ AI Processing Complete</h2>

            <p>
              <strong>Transcript:</strong>
            </p>
            <p>{result.transcript}</p>

            <hr />

            <p>
              <strong>Title:</strong> {result.aiAnalysis?.title}
            </p>

            <p>
              <strong>Emergency:</strong>{" "}
              {result.aiAnalysis?.emergencyType}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              {result.aiAnalysis?.priority}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {result.aiAnalysis?.recommendedDepartment}
            </p>

            <p>
              <strong>Risk:</strong>{" "}
              {result.aiAnalysis?.riskLevel}
            </p>

            <p>
              <strong>Location:</strong>{" "}
              {result.aiAnalysis?.location || "Unknown"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}