import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MoodDetection from "./pages/MoodDetection";
import ChatMood from "./pages/ChatMood";
import Recommendations from "./pages/Recommendations";
import Favorites from "./pages/Favorites";
import Playlists from "./pages/Playlists";
import History from "./pages/History";
import ProtectedRoute from "./components/ProtectedRoute";
import Intro from "./pages/Intro"; // 👈 added
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-container">
        <Routes>
          {/* 🟣 Intro Video Route */}
          <Route path="/" element={<Intro />} />

          {/* After intro, redirect to login */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Main sections */}
          <Route
            path="/home"
            // element={<ProtectedRoute><Home /></ProtectedRoute>}
            element={<Home />}
          />
          <Route
            path="/mood-detection"
            // element={<ProtectedRoute><MoodDetection /></ProtectedRoute>}
            element={<MoodDetection />}
          />
          <Route
            path="/chat-mood"
            // element={<ProtectedRoute><ChatMood /></ProtectedRoute>}
            element={<ChatMood />}
          />
          <Route
            path="/recommendations"
            // element={<ProtectedRoute><Recommendations /></ProtectedRoute>}
            element={<Recommendations />}
          />
          <Route
            path="/favorites"
            // element={<ProtectedRoute><Favorites /></ProtectedRoute>}
            element={<Favorites />}
          />
          <Route
            path="/playlists"
            // element={<ProtectedRoute><Playlists /></ProtectedRoute>}
            element={<Playlists />}
          />
          <Route
            path="/history"
            // element={<ProtectedRoute><History /></ProtectedRoute>}
            element={<History />}
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
