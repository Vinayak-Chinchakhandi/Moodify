import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MoodDetection from "./pages/MoodDetection";
import ChatMood from "./pages/ChatMood";
import Recommendations from "./pages/Recommendations";
import Favorites from "./pages/Favorites";
import Playlists from "./pages/Playlists";
import History from "./pages/History";
import Profile from "./pages/Profile";
import ManualSelection from "./pages/ManualSelection";
import Intro from "./pages/Intro";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="main-container">
        <Routes>
          {/* 🟣 Intro Page */}
          <Route path="/" element={<Intro />} />

          {/* 🔐 Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🏠 Protected Main Pages */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/mood-detection" element={<ProtectedRoute><MoodDetection /></ProtectedRoute>} />
          <Route path="/chat-mood" element={<ProtectedRoute><ChatMood /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/manual-selection" element={<ProtectedRoute><ManualSelection /></ProtectedRoute>} />

          {/* 🚫 Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
