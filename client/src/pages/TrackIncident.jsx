import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function TrackIncident() {
  const { id } = useParams();

  const [incident, setIncident] = useState(null);

  useEffect(() => {
    api
      .get(`/incidents/${id}`)
      .then((res) => setIncident(res.data))
      .catch(console.error);
  }, [id]);

  if (!incident) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>🚨 Incident #{incident.id}</h1>

      <p>
        <strong>Title:</strong> {incident.title}
      </p>

      <p>
        <strong>Status:</strong> {incident.status}
      </p>

      <p>
        <strong>Priority:</strong> {incident.priority}
      </p>

      <p>
        <strong>Location:</strong>{" "}
        {incident.location || "Unknown"}
      </p>

      <p>
        <strong>Department:</strong>{" "}
        {incident.recommendedDepartment || "Pending"}
      </p>
    </div>
  );
}