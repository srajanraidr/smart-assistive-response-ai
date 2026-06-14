import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/sidebar.css";

export default function Sidebar() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <>
      <aside className="sidebar">
        <h2 className="sidebar-logo">🚨 SARA</h2>

        <nav className="sidebar-nav">
          {/* Dashboard */}
          {(role === "ADMIN" ||
            role === "DISPATCHER" ||
            role === "OPERATOR") && (
            <Link to="/dashboard">🏠 Dashboard</Link>
          )}

          {/* Upload Audio */}
          {(role === "ADMIN" || role === "OPERATOR") && (
            <Link to="/upload-audio">🎤 Upload Audio</Link>
          )}

          {/* Analyze */}
          {(role === "ADMIN" || role === "OPERATOR") && (
            <Link to="/analyze">🤖 Analyze Text</Link>
          )}

          {/* Live Map */}
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
          {/* Analytics */}
          {(role === "ADMIN" || role === "DISPATCHER") && (
            <Link to="/analytics">📊 Analytics</Link>
          )}
        </nav>

        {/* Logout Button */}
        <button
          className="logout-btn"
          onClick={() => setShowLogoutModal(true)}
        >
          🚪 Logout
        </button>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Confirm Logout</h3>

            <p>
              Are you sure you want to log out of your SARA account?
            </p>

            <div className="logout-actions">
              <button onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>

              <button onClick={handleLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}