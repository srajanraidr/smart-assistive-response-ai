import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  LineChart,
  Line,
} from "recharts";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}
    >
      <h3
        style={{
          color: "#6b7280",
          marginBottom: "10px",
          fontSize: "18px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color: "#111827",
          fontSize: "40px",
          margin: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/incidents/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <h2>Loading Analytics...</h2>;
  }

  if (!stats) {
    return <h2>No analytics available.</h2>;
  }

  const priorityData = [
    {
      name: "LOW",
      count: stats.low || 0,
      fill: "#22c55e",
    },
    {
      name: "MEDIUM",
      count: stats.medium || 0,
      fill: "#eab308",
    },
    {
      name: "HIGH",
      count: stats.high || 0,
      fill: "#f97316",
    },
    {
      name: "CRITICAL",
      count: stats.critical || 0,
      fill: "#ef4444",
    },
  ];

  const emergencyData = [
    { name: "Medical", value: stats.medical || 0 },
    { name: "Fire", value: stats.fire || 0 },
    { name: "Crime", value: stats.crime || 0 },
    { name: "Accident", value: stats.accident || 0 },
    { name: "Rescue", value: stats.rescue || 0 },
    { name: "Hazmat", value: stats.hazardous || 0 },
    { name: "Disaster", value: stats.disaster || 0 },
    { name: "Domestic", value: stats.domestic || 0 },
    { name: "Infrastructure", value: stats.infrastructure || 0 },
    { name: "Other", value: stats.other || 0 },
  ];

  const COLORS = [
    "#3b82f6",
    "#ef4444",
    "#8b5cf6",
    "#f59e0b",
    "#10b981",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#6366f1",
    "#6b7280",
  ];

  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          marginBottom: "30px",
          color: "#111827",
        }}
      >
        📊 SARA Analytics Dashboard
      </h1>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <StatCard title="Total Incidents" value={stats.total || 0} />
        <StatCard title="Active" value={stats.active || 0} />
        <StatCard title="Closed" value={stats.closed || 0} />
        <StatCard title="Critical" value={stats.critical || 0} />
        <StatCard title="Medical" value={stats.medical || 0} />
        <StatCard title="Fire" value={stats.fire || 0} />
        <StatCard title="Crime" value={stats.crime || 0} />
        <StatCard
          title="AI Confidence"
          value={`${Math.round(
            (Number(stats.averageAiConfidence) || 0) * 100
          )}%`}
        />
      </div>

{/* ================= PRIORITY CHART ================= */}
<div
  style={{
    marginTop: "40px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  }}
>
  <h2 style={{ color: "#111827", marginBottom: "20px" }}>
    🚨 Incidents by Priority
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={priorityData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count">
        {priorityData.map((item) => (
          <Cell
            key={item.name}
            fill={item.fill}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>

{/* ================= PIE CHART ================= */}
<div
  style={{
    marginTop: "40px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  }}
>
  <h2 style={{ color: "#111827", marginBottom: "20px" }}>
    🏥 Emergency Type Distribution
  </h2>

  <ResponsiveContainer width="100%" height={420}>
    <PieChart>
      <Pie
        data={emergencyData}
        dataKey="value"
        nameKey="name"
        outerRadius={140}
        label
      >
        {emergencyData.map((entry, index) => (
          <Cell
            key={entry.name}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

{/* ================= LINE CHART ================= */}
<div
  style={{
    marginTop: "40px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  }}
>
  <h2 style={{ color: "#111827", marginBottom: "20px" }}>
    📈 Incidents Over Time
  </h2>

  <ResponsiveContainer width="100%" height={320}>
    <LineChart data={stats.incidentsOverTime || []}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="count"
        stroke="#2563eb"
        strokeWidth={3}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
    </div>
  );
}