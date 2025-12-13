import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
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
import Stream from "./pages/Stream";
import ProtectedRoute from "./components/ProtectedRoute";
import PageWrapper from "./components/PageWrapper";
import "./App.css";

const ProtectedLayout = () => (
  <ProtectedRoute>
    <PageWrapper>
      <Outlet />
    </PageWrapper>
  </ProtectedRoute>
);

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

          {/* 🏠 Protected Main Pages (single PageWrapper keeps global player mounted) */}
          <Route element={<ProtectedLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/mood-detection" element={<MoodDetection />} />
            <Route path="/chat-mood" element={<ChatMood />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/stream" element={<Stream />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/manual-selection" element={<ManualSelection />} />
          </Route>

          {/* 🚫 Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
