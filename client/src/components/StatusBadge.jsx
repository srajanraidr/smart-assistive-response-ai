export default function StatusBadge({ status }) {
  const colors = {
    NEW: "#2563eb",
    REVIEW: "#7c3aed",
    ASSIGNED: "#9333ea",
    EN_ROUTE: "#f97316",
    ON_SCENE: "#eab308",
    RESOLVED: "#22c55e",
    CLOSED: "#6b7280",
  };

  return (
    <span
      style={{
        background: colors[status] || "#6b7280",
        color: "white",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {status}
    </span>
  );
}