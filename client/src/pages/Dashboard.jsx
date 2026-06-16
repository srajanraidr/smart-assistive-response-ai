import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import socket from "../socket";
import "../styles/dashboard.css";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";

function StatusColumn({ title, incidents, navigate }) {
  return (
    <div
      style={{
        minWidth: "300px",
        flex: 1,
        background: "#51667a",
        borderRadius: "12px",
        padding: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ marginBottom: "16px" }}>
        {title} ({incidents.length})
      </h2>

      {incidents.length === 0 && (
        <p style={{ color: "#6b7280" }}>
          No incidents
        </p>
      )}

      {incidents.map((incident) => (
        <div
          key={incident.id}
          onClick={() =>
            navigate(`/incidents/${incident.id}`)
          }
          style={{
            background: "#f8f8f8",
            borderRadius: "10px",
            padding: "12px",
            marginBottom: "12px",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          }}
        >
          <h4 style={{ margin: 0 }}>
            {incident.title}
          </h4>

          <p>
            <strong>🚨 Priority:</strong>{" "}
            <PriorityBadge priority={incident.priority} />
          </p>

          <p>📂 {incident.emergencyType}</p>

          <p>
            📍{" "}
            {incident.location || "Unknown"}
          </p>

          {incident.recommendedDepartment && (
            <p>
              🏥{" "}
              {
                incident.recommendedDepartment
              }
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [search, setSearch] = useState("");
  const [notification, setNotification] =
    useState("");

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
        if (
          prev.some((i) => i.id === incident.id)
        ) {
          return prev;
        }

        return [incident, ...prev];
      });

      setNotification(
        `🚨 New Incident: ${incident.title}`
      );

      setTimeout(() => {
        setNotification("");
      }, 5000);
    };

    const handleIncidentUpdated = (
      updatedIncident
    ) => {
      setIncidents((prev) =>
        prev.map((incident) =>
          incident.id === updatedIncident.id
            ? updatedIncident
            : incident
        )
      );
    };

    socket.on(
      "new-incident",
      handleNewIncident
    );
    socket.on(
      "incident-updated",
      handleIncidentUpdated
    );

    return () => {
      socket.off(
        "new-incident",
        handleNewIncident
      );
      socket.off(
        "incident-updated",
        handleIncidentUpdated
      );
    };
  }, []);

  const filteredIncidents =
    incidents.filter((incident) => {
      const q = search.toLowerCase();

      return (
        incident.title
          .toLowerCase()
          .includes(q) ||
        incident.emergencyType
          .toLowerCase()
          .includes(q) ||
        (incident.location || "")
          .toLowerCase()
          .includes(q)
      );
    });

  const newIncidents =
    filteredIncidents.filter(
      (i) => i.status === "NEW"
    );

  const assignedIncidents =
    filteredIncidents.filter(
      (i) => i.status === "ASSIGNED"
    );

  const enRouteIncidents =
    filteredIncidents.filter(
      (i) => i.status === "EN_ROUTE"
    );

  const onSceneIncidents =
    filteredIncidents.filter(
      (i) => i.status === "ON_SCENE"
    );

  const resolvedIncidents =
    filteredIncidents.filter(
      (i) => i.status === "RESOLVED"
    );

  return (
    <div style={{ padding: "24px" }}>
      <h1>🚨 SARA Command Center</h1>

      {notification && (
        <div
          style={{
            background: "#dc2626",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          {notification}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4,1fr)",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div className="stat-card">
          <h3>Total</h3>
          <h2>{incidents.length}</h2>
        </div>

        <div className="stat-card">
          <h3>Critical</h3>
          <h2>
            {
              incidents.filter(
                (i) =>
                  i.priority ===
                  "CRITICAL"
              ).length
            }
          </h2>
        </div>

        <div className="stat-card">
          <h3>Active</h3>
          <h2>
            {
              incidents.filter(
                (i) =>
                  i.status !==
                    "RESOLVED" &&
                  i.status !==
                    "CLOSED"
              ).length
            }
          </h2>
        </div>

        <div className="stat-card">
          <h3>Resolved</h3>
          <h2>
            {
              incidents.filter(
                (i) =>
                  i.status ===
                  "RESOLVED"
              ).length
            }
          </h2>
        </div>
      </div>

      <input
        type="text"
        placeholder="🔍 Search incidents..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "24px",
          borderRadius: "8px",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          alignItems: "flex-start",
        }}
      >
        <StatusColumn
          title="🆕 NEW"
          incidents={newIncidents}
          navigate={navigate}
        />

        <StatusColumn
          title="👤 ASSIGNED"
          incidents={assignedIncidents}
          navigate={navigate}
        />

        <StatusColumn
          title="🚑 EN ROUTE"
          incidents={enRouteIncidents}
          navigate={navigate}
        />

        <StatusColumn
          title="📍 ON SCENE"
          incidents={onSceneIncidents}
          navigate={navigate}
        />

        <StatusColumn
          title="✅ RESOLVED"
          incidents={resolvedIncidents}
          navigate={navigate}
        />
      </div>
    </div>
  );
}

