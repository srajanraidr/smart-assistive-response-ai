import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import socket from "../socket";
import "leaflet/dist/leaflet.css";

export default function MapView() {
  const [incidents, setIncidents] = useState([]);
  const navigate = useNavigate();

 useEffect(() => {
  const fetchIncidents = async () => {
    const res = await api.get("/incidents");
    setIncidents(res.data);
  };

  fetchIncidents();

  const handleNewIncident = (incident) => {
    if (
      incident.latitude != null &&
      incident.longitude != null
    ) {
      setIncidents((prev) => {
        if (prev.some((i) => i.id === incident.id)) {
          return prev;
        }
        return [incident, ...prev];
      });
    }
  };

  socket.on("new-incident", handleNewIncident);

  return () => {
    socket.off("new-incident", handleNewIncident);
  };
}, []);
  return (
    <div style={{ height: "90vh", width: "100%" }}>
      <MapContainer
        center={[20.5937, 78.9629]} // India center
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {incidents
          .filter(
            (incident) =>
              incident.latitude != null && incident.longitude != null
          )
          .map((incident) => (
            <Marker
              key={incident.id}
              position={[incident.latitude, incident.longitude]}
            >
              <Popup>
                <strong>{incident.title}</strong>
                <br />
                {incident.emergencyType}
                <br />
                Priority: {incident.priority}
                <br />
                <button
                  onClick={() =>
                    navigate(`/incidents/${incident.id}`)
                  }
                >
                  View Details
                </button>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}