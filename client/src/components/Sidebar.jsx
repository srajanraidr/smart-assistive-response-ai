import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <aside className="sidebar">
        <h2 className="sidebar-logo">🚨 SARA</h2>

        {/* User Info */}
        <div className="user-card">
  <h3>👤 {user.fullName || "User"}</h3>
  <p>🛡️ {role}</p>
</div>

        <nav className="sidebar-nav">
          {/* Dashboard */}
          {(role === "ADMIN" ||
            role === "DISPATCHER" ||
            role === "OPERATOR") && (
            <Link to="/dashboard">🏠 Dashboard</Link>
          )}

          {/* Upload */}
          {(role === "ADMIN" || role === "OPERATOR") && (
            <Link to="/upload-audio">🎤 Upload Audio</Link>
          )}

          {/* Analyze */}
          {(role === "ADMIN" || role === "OPERATOR") && (
            <Link to="/analyze">🤖 Analyze Text</Link>
          )}

          {/* Map */}
          {(role === "ADMIN" ||
            role === "DISPATCHER" ||
            role === "OPERATOR") && (
            <Link to="/map">🗺️ Live Map</Link>
          )}

          {/* Completed */}
          {(role === "ADMIN" ||
            role === "DISPATCHER" ||
            role === "OPERATOR") && (
            <Link to="/completed">
              ✅ Completed Incidents
            </Link>
          )}

          {/* Analytics - ADMIN only */}
          {role === "ADMIN" && (
            <Link to="/analytics">📊 Analytics</Link>
          )}
        </nav>

        <button
          className="logout-btn"
          onClick={() => setShowLogoutModal(true)}
        >
          🚪 Logout
        </button>
      </aside>

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Logout</h3>

            <p>
              Are you sure you want to log out?
            </p>

            <div className="logout-actions">
              <button
                onClick={() =>
                  setShowLogoutModal(false)
                }
              >
                Cancel
              </button>

              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}