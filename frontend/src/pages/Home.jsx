import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,#0a0a1a,#000)] text-white overflow-hidden transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,0,255,0.3),0_0_65px_rgba(0,255,255,0.3)]">

      {/* 🌌 Particle Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* === 🔝 Navbar === */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 bg-transparent z-20">
        {/* === Logo + Brand Name === */}
        <Link
          to="/"
          className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform duration-300"
        >
          <img
            src={logo}
            alt="Moodify Logo"
            className="w-12 h-12 rounded-full object-cover"
          />
          <h1 className="text-3xl font-extrabold gradient-text">
            Moodify
          </h1>
        </Link>

        {/* === Navigation Links === */}
        <nav className="flex flex-wrap gap-8 text-lg font-medium text-gray-300">
          <Link to="/favorites" className="hover:text-cyan-400 transition">
            💖 Favorites
          </Link>
          <Link to="/playlists" className="hover:text-pink-400 transition">
            📂 Playlists
          </Link>
          <Link to="/history" className="hover:text-orange-400 transition">
            🕒 History
          </Link>
          <Link to="/profile" className="hover:text-purple-400 transition">
            👤 Profile
          </Link>
          <Link to="/login" className="hover:text-red-400 transition">
            🚪 Logout
          </Link>
        </nav>
      </header>

      {/* === 🏠 Hero Section === */}
      <section className="text-center px-6 mt-24">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 gradient-text">
          Welcome to Moodify 🎧
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12">
          Your personal AI music companion. <br />
          Choose your mood or express it — Moodify will tune the perfect vibe for you.
        </p>

        {/* === Feature Cards === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* === Manual Selection === */}
          <div className="glass-card hover:scale-105 transition-transform duration-300 text-center">
            <h2 className="text-2xl font-semibold mb-3 text-cyan-400">
              🎼 Manual Selection
            </h2>
            <p className="text-gray-300 mb-6">
              Choose your favorite genres, artists, or moods — you’re the DJ.
            </p>
            <Link
              to="/manual-selection"
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition-all"
            >
              Go to Manual Selection
            </Link>
          </div>

          {/* === Mood-Based Detection === */}
          <div className="glass-card hover:scale-105 transition-transform duration-300 text-center">
            <h2 className="text-2xl font-semibold mb-3 text-pink-400">
              😊 Mood Detection
            </h2>
            <p className="text-gray-300 mb-6">
              Let Moodify detect your mood using your expressions and recommend music that matches your emotions.
            </p>
            <Link
              to="/mood-detection"
              className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full transition-all"
            >
              Detect Mood
            </Link>
          </div>

          {/* === Text-Based Emotion === */}
          <div className="glass-card hover:scale-105 transition-transform duration-300 text-center">
            <h2 className="text-2xl font-semibold mb-3 text-orange-400">
              💬 Text-Based Emotion
            </h2>
            <p className="text-gray-300 mb-6">
              Chat with our AI — Moodify reads your mood through your words and recommends songs that fit perfectly.
            </p>
            <Link
              to="/chat-mood"
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-all"
            >
              Chat with AI
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
