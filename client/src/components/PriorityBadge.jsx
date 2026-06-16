export default function PriorityBadge({ priority }) {
  const colors = {
    CRITICAL: "#dc2626",
    HIGH: "#ea580c",
    MEDIUM: "#ca8a04",
    LOW: "#16a34a",
  };

  return (
    <span
      style={{
        background: colors[priority] || "#6b7280",
        color: "#fff",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {priority}
    </span>
  );
}