import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import "../styles/incident-details.css";

export default function IncidentDetails() {
  const { id } = useParams();

  const [incident, setIncident] = useState(null);
  const [history, setHistory] = useState([]);
  const [dispatchers, setDispatchers] = useState([]);
  const [selectedDispatcher, setSelectedDispatcher] = useState("");

  const allowedTransitions = {
    NEW: ["REVIEW"],
    REVIEW: ["ASSIGNED"],
    ASSIGNED: ["EN_ROUTE"],
    EN_ROUTE: ["ON_SCENE"],
    ON_SCENE: ["RESOLVED"],
    RESOLVED: ["CLOSED"],
    CLOSED: [],
  };

  useEffect(() => {
    fetchIncident();
    fetchHistory();
    fetchDispatchers();
  }, [id]);

  const fetchIncident = async () => {
    try {
      const res = await api.get(`/incidents/${id}`);
      setIncident(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/incidents/${id}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDispatchers = async () => {
    try {
      // Change to "/users/dispatchers" if you moved the route
      const res = await api.get("/incidents/dispatchers");
      setDispatchers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (status) => {
    try {
      await api.patch(`/incidents/${id}/status`, {
        status,
      });

      fetchIncident();
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const assignDispatcher = async () => {
    if (!selectedDispatcher) return;

    try {
      await api.patch(`/incidents/${id}/assign`, {
        userId: selectedDispatcher,
      });

      fetchIncident();
    } catch (err) {
      console.error(err);
    }
  };

  if (!incident) {
    return <h2>Loading...</h2>;
  }

  const nextStatuses = allowedTransitions[incident.status] || [];

  const buttons = [
    { label: "Review", value: "REVIEW" },
    { label: "Assign", value: "ASSIGNED" },
    { label: "En Route", value: "EN_ROUTE" },
    { label: "On Scene", value: "ON_SCENE" },
    { label: "Resolve", value: "RESOLVED" },
    { label: "Close", value: "CLOSED" },
  ];

  return (
    <div className="incident-details-container">
      <h1>{incident.title}</h1>

      <div className="detail-card">
        <p>
          <strong>🚨 Emergency Type:</strong> {incident.emergencyType}
        </p>

        <p>
          <strong>🚨 Priority:</strong>{" "}
          <PriorityBadge priority={incident.priority} />
        </p>

        <p>
          <strong>📊 Status:</strong>{" "}
          <StatusBadge status={incident.status} />
        </p>

        <p>
          <strong>📍 Location:</strong>{" "}
          {incident.location || "Unknown"}
        </p>

        <p>
          <strong>🤖 AI Confidence:</strong>{" "}
          {incident.aiConfidence != null
            ? `${Math.round(incident.aiConfidence * 100)}%`
            : "N/A"}
        </p>

        <p>
          <strong>🏢 Recommended Department:</strong>{" "}
          {incident.recommendedDepartment || "N/A"}
        </p>

        <p>
          <strong>🔥 Risk Level:</strong>{" "}
          {incident.riskLevel || "N/A"}
        </p>

        <p>
          <strong>👤 Assigned To:</strong>{" "}
          {incident.assignedTo
            ? incident.assignedTo.fullName
            : "Unassigned"}
        </p>

        <p>
          <strong>📝 Description:</strong>
        </p>

        <p>{incident.description || "No description"}</p>

        {Array.isArray(incident.keywords) &&
          incident.keywords.length > 0 && (
            <>
              <strong>🏷️ Keywords:</strong>

              <div style={{ marginTop: 10 }}>
                {incident.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      marginRight: "8px",
                      marginBottom: "8px",
                      borderRadius: "20px",
                      background: "#e5e7eb",
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </>
          )}
      </div>

      <h2>Assign Dispatcher</h2>

      <div style={{ marginBottom: "20px" }}>
        <select
          value={selectedDispatcher}
          onChange={(e) =>
            setSelectedDispatcher(e.target.value)
          }
        >
          <option value="">Select dispatcher</option>

          {dispatchers.map((dispatcher) => (
            <option
              key={dispatcher.id}
              value={dispatcher.id}
            >
              {dispatcher.fullName}
            </option>
          ))}
        </select>

        <button
          style={{ marginLeft: "10px" }}
          onClick={assignDispatcher}
        >
          Assign
        </button>
      </div>

      <h2>Status Actions</h2>

      <div className="button-group">
        {buttons.map((button) => (
          <button
            key={button.value}
            disabled={
              !nextStatuses.includes(button.value)
            }
            onClick={() =>
              updateStatus(button.value)
            }
          >
            {button.label}
          </button>
        ))}
      </div>
      <h2>📜 Incident Timeline</h2>

{history.length === 0 ? (
  <p>No history available.</p>
) : (
  <div style={{ marginTop: "20px" }}>
    {history.map((item) => (
      <div
        key={item.id}
        style={{
          borderLeft: "4px solid #2563eb",
          paddingLeft: "16px",
          marginBottom: "20px",
        }}
      >
        <h4 style={{ margin: 0 }}>
          {item.oldStatus
            ? `${item.oldStatus} → ${item.newStatus}`
            : item.action}
        </h4>

        {item.message && (
          <p style={{ margin: "6px 0" }}>
            {item.message}
          </p>
        )}

        <small>
          {new Date(item.changedAt).toLocaleString()}
        </small>
      </div>
    ))}
  </div>
)}
    </div>
  );
}
