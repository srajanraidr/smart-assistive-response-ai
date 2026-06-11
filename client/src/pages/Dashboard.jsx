import { useEffect, useState } from "react";
import api from "../api/axios";
import {useNavigate} from "react-router-dom";
import socket from "../socket";
import "../styles/dashboard.css";
export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchIncidents = async () => {
    try {
      const res = await api.get("/incidents");
      setIncidents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Load existing incidents once
  fetchIncidents();

  // Listen for new incidents
  const handleNewIncident = (incident) => {
    setIncidents((prev) => [incident, ...prev]);
  };

  socket.on("new-incident", handleNewIncident);

  // Cleanup
  return () => {
    socket.off("new-incident", handleNewIncident);
  };
}, []);

  return (
    <div className="dashboard-container">
  <h1 className="dashboard-title">SARA Dashboard</h1>

  {incidents.map((incident) => (
    <div
      key={incident.id}
      className="incident-card"
      onClick={() => navigate(`/incidents/${incident.id}`)}
    >
      <h2 className="incident-title">{incident.title}</h2>

      <p className="incident-info">
        <strong>🚨 Priority:</strong> {incident.priority}
      </p>

      <p className="incident-info">
        <strong>📂 Emergency:</strong> {incident.emergencyType}
      </p>

      <p className="incident-info">
        <strong>📍 Location:</strong> {incident.location || "Unknown"}
      </p>

      <p className="incident-info">
        <strong>📊 Status:</strong> {incident.status}
      </p>

      <p className="incident-info">
        <strong>🤖 AI Confidence:</strong>{" "}
        {incident.aiConfidence != null
          ? `${Math.round(incident.aiConfidence * 100)}%`
          : "N/A"}
      </p>
    </div>
  ))}
</div>
  );
}