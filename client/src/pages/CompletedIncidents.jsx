import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CompletedIncidents() {
  const [incidents, setIncidents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await api.get("/incidents/completed");
        setIncidents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCompleted();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Completed Incidents</h1>

      {incidents.length === 0 ? (
        <p>No completed incidents.</p>
      ) : (
        incidents.map((incident) => (
          <div
            key={incident.id}
            onClick={() => navigate(`/incidents/${incident.id}`)}
            style={{
              cursor: "pointer",
              padding: "16px",
              marginBottom: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h3>{incident.title}</h3>
            <p>Status: {incident.status}</p>
            <p>Priority: {incident.priority}</p>
            <p>Location: {incident.location || "Unknown"}</p>
          </div>
        ))
      )}
    </div>
  );
}