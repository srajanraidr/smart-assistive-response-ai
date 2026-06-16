import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1>🚨 SARA</h1>

        <h2>Smart AI Response Assistant</h2>

        <p>
          Welcome to SARA, an AI-powered emergency response platform.
          Report emergencies quickly using your voice or an audio recording.
          Our AI will analyze the situation and automatically create an
          incident for emergency responders.
        </p>

        <div className="hero-buttons">
          <Link to="/report" className="primary-btn">
            🚨 Report Emergency
          </Link>

          <Link to="/login" className="secondary-btn">
            👨‍💼 Staff Login
          </Link>
        </div>
      </div>
    </div>
  );
}