import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import socket from "../socket";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [search, setSearch] = useState("");

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

    fetchIncidents();

    const handleNewIncident = (incident) => {
      setIncidents((prev) => {
        const exists = prev.some((i) => i.id === incident.id);
        if (exists) return prev;

        return [incident, ...prev];
      });
    };

    socket.on("new-incident", handleNewIncident);

    return () => {
      socket.off("new-incident", handleNewIncident);
    };
  }, []);

  // Dashboard statistics
  const total = incidents.length;

  const critical = incidents.filter(
    (i) => i.priority === "CRITICAL"
  ).length;

  const active = incidents.filter(
    (i) => i.status !== "RESOLVED" && i.status !== "CLOSED"
  ).length;

  const resolved = incidents.filter(
    (i) => i.status === "RESOLVED"
  ).length;

  // Search filter
  const filteredIncidents = incidents.filter((incident) => {
    const query = search.toLowerCase();

    return (
      incident.title.toLowerCase().includes(query) ||
      incident.emergencyType.toLowerCase().includes(query) ||
      (incident.location || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🚨 SARA Dashboard</h1>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Incidents</h3>
          <p>{total}</p>
        </div>

        <div className="stat-card">
          <h3>Critical</h3>
          <p>{critical}</p>
        </div>

        <div className="stat-card">
          <h3>Active</h3>
          <p>{active}</p>
        </div>

        <div className="stat-card">
          <h3>Resolved</h3>
          <p>{resolved}</p>
        </div>
      </div>

      {/* Search */}
      <input
        className="search-box"
        type="text"
        placeholder="🔍 Search by title, type or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Incident List */}
      {filteredIncidents.length === 0 ? (
        <p style={{ marginTop: "20px" }}>No incidents found.</p>
      ) : (
        filteredIncidents.map((incident) => (
          <div
            key={incident.id}
            className="incident-card"
            onClick={() => navigate(`/incidents/${incident.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h2 className="incident-title">{incident.title}</h2>

            <p className="incident-info">
              <strong>🚨 Priority:</strong> {incident.priority}
            </p>

            <p className="incident-info">
              <strong>📂 Emergency:</strong> {incident.emergencyType}
            </p>

            <p className="incident-info">
              <strong>📍 Location:</strong>{" "}
              {incident.location || "Unknown"}
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

            {incident.recommendedDepartment && (
              <p className="incident-info">
                <strong>🏥 Department:</strong>{" "}
                {incident.recommendedDepartment}
              </p>
            )}

            {incident.riskLevel && (
              <p className="incident-info">
                <strong>⚠️ Risk:</strong> {incident.riskLevel}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}