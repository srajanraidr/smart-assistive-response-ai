import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import "../styles/uploadAudio.css";
import { Link } from "react-router-dom";

export default function UploadAudio() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [recordedBlob, setRecordedBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [latitude, setLatitude] = useState(null);
const [longitude, setLongitude] = useState(null);


useEffect(() => {
  if (!navigator.geolocation) {
    console.log("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    },
    (error) => {
      console.error("Location access denied:", error);
    }
  );
}, []);
  // -----------------------------
  // Upload selected or recorded audio
  // -----------------------------
  const handleUpload = async () => {
    let uploadFile = file;

    // If no file selected but recording exists, use recording
    if (!uploadFile && recordedBlob) {
      uploadFile = new File(
        [recordedBlob],
        "recording.webm",
        {
          type: "audio/webm",
        }
      );
    }

    if (!uploadFile) {
      alert("Please upload or record audio first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("audio", uploadFile);
      if (latitude !== null && longitude !== null) {
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
}

      const res = await api.post(
        "/calls/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Start recording
  // -----------------------------
  const startRecording = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const mediaRecorder =
        new MediaRecorder(stream);

      mediaRecorderRef.current =
        mediaRecorder;

      chunksRef.current = [];

      mediaRecorder.ondataavailable = (
        event
      ) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(
          chunksRef.current,
          {
            type: "audio/webm",
          }
        );

        setRecordedBlob(blob);

        const url =
          URL.createObjectURL(blob);

        setAudioURL(url);

        // Stop microphone
        stream
          .getTracks()
          .forEach((track) =>
            track.stop()
          );
      };

      mediaRecorder.start();

      setRecording(true);
    } catch (error) {
      console.error(error);
      alert(
        "Could not access microphone."
      );
    }
  };

  // -----------------------------
  // Stop recording
  // -----------------------------
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  }}
>
  <Link
    to="/"
    style={{
      textDecoration: "none",
      fontWeight: "bold",
      color: "#2563eb",
    }}
  >
    ← 🏠 Home
  </Link>

  <Link
    to="/login"
    style={{
      textDecoration: "none",
      fontWeight: "bold",
      color: "#16a34a",
    }}
  >
    👨‍💼 Staff Login
  </Link>
</div>
        <h1>
          🎤 Emergency Audio Analyzer
        </h1>

        <p>
          Upload an audio file or record
          directly from your microphone.
          SARA will transcribe, analyze,
          and automatically create an
          incident.
        </p>

        <hr />

        <h3>📁 Upload Audio File</h3>

        <input
          type="file"
          accept="audio/*"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <hr
          style={{ margin: "20px 0" }}
        />

        <h3>
          🎙️ Record Emergency
        </h3>

        {!recording ? (
          <button
            onClick={startRecording}
          >
            🎙️ Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
          >
            ⏹️ Stop Recording
          </button>
        )}

        {audioURL && (
          <div
            style={{
              marginTop: "20px",
            }}
          >
            <h4>
              ▶️ Recorded Audio
            </h4>

            <audio
              controls
              src={audioURL}
              style={{
                width: "100%",
              }}
            />
          </div>
        )}

        <div
          style={{
            marginTop: "25px",
          }}
        >
          <button
            onClick={handleUpload}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : "🚀 Analyze & Create Incident"}
          </button>
        </div>

        {result?.incident && (
  <div
    style={{
      marginTop: "20px",
      padding: "20px",
      border: "2px solid #16a34a",
      borderRadius: "10px",
      background: "#f0fdf4",
    }}
  >
    <h2>✅ Emergency Submitted Successfully</h2>


    <p>
      <strong>Incident ID:</strong>{" "}
      {result.incident.id}
    </p>

    <p>
      <strong>Status:</strong>{" "}
      {result.incident.status}
    </p>

    <p>
      <strong>Priority:</strong>{" "}
      {result.incident.priority}
    </p>

    <p>
      Our emergency team has received your report.
    </p>
    <Link to={`/track/${result.incident.id}`}>
  🔍 Track Your Emergency
</Link>
  </div>
)}
      </div>
    </div>
  );
}