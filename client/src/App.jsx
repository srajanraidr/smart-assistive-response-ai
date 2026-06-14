import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import IncidentDetails from "./pages/IncidentDetails";
import UploadAudio from "./pages/UploadAudio";
import MapView from "./pages/MapView";
import CompletedIncidents from "./pages/CompletedIncidents";
import Analytics from "./pages/Analytics";

function Layout() {
  const location = useLocation();

  // Login page is "/"
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {/* Only show sidebar after login */}
      {!isLoginPage && <Sidebar />}

      {/* Main content */}
      <div
        style={{
          marginLeft: isLoginPage ? "0" : "240px",
          minHeight: "100vh",
          padding: "24px",
        }}
      >
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Analyze */}
          <Route
            path="/analyze"
            element={
              <ProtectedRoute>
                <Analyze />
              </ProtectedRoute>
            }
          />

          {/* Upload Audio */}
          <Route
            path="/upload-audio"
            element={
              <ProtectedRoute>
                <UploadAudio />
              </ProtectedRoute>
            }
          />

          {/* Incident Details */}
          <Route
            path="/incidents/:id"
            element={
              <ProtectedRoute>
                <IncidentDetails />
              </ProtectedRoute>
            }
          />

          {/* Live Map */}
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            }
          />

          {/* Completed Incidents */}
          <Route
            path="/completed"
            element={
              <ProtectedRoute>
                <CompletedIncidents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}