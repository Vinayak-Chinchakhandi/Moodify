import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import PageWrapper from "../components/PageWrapper";

const Home = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    const c = window.confirm("Are you sure you want to logout?");
    if (!c) return;

    await logout(); // removes localStorage + firebase session
    window.location.href = "/login"; // HARD redirect → fixes all issues
  };

  return (
    <PageWrapper>
      {/* === 🔝 Navbar === */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-10 py-6 bg-transparent z-30">
        <Link
          to="/home"
          className="flex items-center gap-3 hover:scale-105 transition-transform duration-300"
        >
          <img src={logo} alt="Moodify Logo" className="w-12 h-12 rounded-full" />
          <h1 className="text-3xl font-extrabold gradient-text">Moodify</h1>
        </Link>

        <nav className="flex flex-wrap gap-8 text-lg font-medium text-gray-300">
          <Link to="/favorites" className="hover:text-cyan-400">💖 Favorites</Link>
          <Link to="/playlists" className="hover:text-pink-400">📂 Playlists</Link>
          <Link to="/history" className="hover:text-orange-400">🕒 History</Link>
          <Link to="/profile" className="hover:text-purple-400">👤 Profile</Link>

          {/* FIXED LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="hover:text-red-400 cursor-pointer"
          >
            🚪 Logout
          </button>
        </nav>
      </header>

      {/* === 🏠 Hero Section === */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 pt-32 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 gradient-text">
          Welcome to Moodify 🎧
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12">
          Your personal AI music companion. <br />
          Choose your mood or express it — Moodify will tune the perfect vibe for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="glass-card hover:scale-105 transition-transform duration-300 text-center">
            <h2 className="text-2xl font-semibold mb-3 text-cyan-400">🎼 Manual Selection</h2>
            <p className="text-gray-300 mb-6">Choose your favorite genres, artists, or moods.</p>
            <Link to="/manual-selection" className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-full transition-all">
              Go to Manual Selection
            </Link>
          </div>

          <div className="glass-card hover:scale-105 transition-transform duration-300 text-center">
            <h2 className="text-2xl font-semibold mb-3 text-pink-400">😊 Mood Detection</h2>
            <p className="text-gray-300 mb-6">
              Let Moodify detect your mood using expressions.
            </p>
            <Link to="/mood-detection" className="px-6 py-2 bg-pink-500 hover:bg-pink-600 rounded-full transition-all">
              Detect Mood
            </Link>
          </div>

          <div className="glass-card hover:scale-105 transition-transform duration-300 text-center">
            <h2 className="text-2xl font-semibold mb-3 text-orange-400">💬 Text Emotion</h2>
            <p className="text-gray-300 mb-6">
              Chat with AI — Moodify reads your mood through words.
            </p>
            <Link to="/chat-mood" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-full transition-all">
              Chat with AI
            </Link>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
};

export default Home;