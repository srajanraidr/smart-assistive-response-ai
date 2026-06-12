import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/incident-details.css";
import api from "../api/axios";

export default function IncidentDetails() {
  const { id } = useParams();

  const [incident, setIncident] = useState(null);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const res = await api.get(`/incidents/${id}`);
        setIncident(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchIncident();
  }, [id]);

  const updateStatus = async(status)=>{
    try{
       await api.patch(`/incidents/${id}/status`, {
      status,
    });

    const updated = await api.get(`/incidents/${id}`);
    setIncident(updated.data);
  }
catch(error){
    console.error(error);
}}
  if (!incident) {
    return <p>Loading...</p>;
  }

  return (
    <div className="incident-details-container">
  <h1 className="incident-details-title">{incident.title}</h1>

  <p className="detail-row">
    <strong>Emergency Type:</strong> {incident.emergencyType}
  </p>

  <p className="detail-row">
    <strong>Priority:</strong> {incident.priority}
  </p>

  <p className="detail-row">
    <strong>Status:</strong> {incident.status}
  </p>

  <p className="detail-row">
    <strong>Location:</strong> {incident.location || "Unknown"}
  </p>

  <p className="detail-row">
    <strong>AI Confidence:</strong>{" "}
    {incident.aiConfidence != null
      ? `${Math.round(incident.aiConfidence * 100)}%`
      : "N/A"}
  </p>

  <p className="detail-row">
    <strong>Description:</strong> {incident.description}
  </p>

  <div className="action-buttons">
    <button
      type="button"
      onClick={() => updateStatus("REVIEW")}
      disabled={incident.status === "REVIEW"}
    >
      REVIEW
    </button>
    <button
      type="button"
      onClick={() => updateStatus("ASSIGNED")}
      disabled={incident.status === "ASSIGNED"}
    >
      Assign
    </button>
    <button
      type="button"
      onClick={() => updateStatus("RESOLVED")}
      disabled={incident.status === "RESOLVED"}
    >
      Resolve
    </button>
    <button
      type="button"
      onClick={() => updateStatus("CLOSED")}
      disabled={incident.status === "CLOSED"}
    >
      Close
    </button>
  </div>
  <p>
  <strong>Recommended Department:</strong>{" "}
  {incident.recommendedDepartment || "Unknown"}
</p>

<p>
  <strong>Risk Level:</strong>{" "}
  {incident.riskLevel || "Unknown"}
</p>

<p>
  <strong>Requires Human Review:</strong>{" "}
  {incident.requiresHumanReview ? "Yes" : "No"}
</p>

<p>
  <strong>Keywords:</strong>{" "}
  {Array.isArray(incident.keywords)
    ? incident.keywords.join(", ")
    : "None"}
</p>
</div>
  );
}