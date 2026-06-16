import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Analyze from "./pages/Analyze";
import IncidentDetails from "./pages/IncidentDetails";
import UploadAudio from "./pages/UploadAudio";
import MapView from "./pages/MapView";
import CompletedIncidents from "./pages/CompletedIncidents";
import Analytics from "./pages/Analytics";
import TrackIncident from "./pages/TrackIncident";

function Layout() {
  const location = useLocation();

  // Hide sidebar on public pages
  const hideLayout =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/report";

  return (
    <>
      {/* Sidebar only for authenticated staff pages */}
      {!hideLayout && <Sidebar />}

      {/* Main content */}
      <div
        style={{
          marginLeft: hideLayout ? "0" : "240px",
          minHeight: "100vh",
          padding: hideLayout ? "0" : "24px",
        }}
      >
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Public emergency reporting */}
          <Route path="/report" element={<UploadAudio />} />

          {/* Protected Staff Pages */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analyze"
            element={
              <ProtectedRoute>
                <Analyze />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload-audio"
            element={
              <ProtectedRoute>
                <UploadAudio />
              </ProtectedRoute>
            }
          />

          <Route
            path="/incidents/:id"
            element={
              <ProtectedRoute>
                <IncidentDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            }
          />

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

          <Route
            path="/track/:id"
            element={
              <ProtectedRoute>
                <TrackIncident />
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