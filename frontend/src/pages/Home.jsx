import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Home = () => {
  const { logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const c = window.confirm("Are you sure you want to logout?");
    if (!c) return;

    await logout(); // removes localStorage + firebase session
    window.location.href = "/login"; // HARD redirect → fixes all issues
  };

  return (
    <>
      {/* === 🔝 Navbar === */}
      <header className="fixed top-0 left-0 w-full z-30 backdrop-blur-xl bg-black/20 border-b border-white/10">

        <div className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 md:py-6">

          <Link
            to="/home"
            className="flex items-center gap-2 sm:gap-3 hover:scale-105 transition-transform duration-300"
          >
            <img
              src={logo}
              alt="Moodify Logo"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full"
            />

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold gradient-text">
              Moodify
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-lg font-medium text-gray-300">
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

            <button
              onClick={handleLogout}
              className="hover:text-red-400 transition"
            >
              🚪 Logout
            </button>
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
      md:hidden
      p-2
      rounded-xl
      bg-white/10
      backdrop-blur-xl
      border
      border-white/10
      text-cyan-400
      hover:text-pink-400
      hover:bg-white/20
      transition-all
      "
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="
      md:hidden
      mx-4
      mb-4
      rounded-2xl
      bg-white/10
      backdrop-blur-2xl
      border
      border-white/10
      overflow-hidden
      shadow-[0_0_30px_rgba(0,255,255,0.1)]
      "
          >
            <div className="flex flex-col">

              <Link
                to="/favorites"
                className="px-5 py-4 hover:bg-cyan-500/10"
              >
                💖 Favorites
              </Link>

              <Link
                to="/playlists"
                className="px-5 py-4 hover:bg-pink-500/10"
              >
                📂 Playlists
              </Link>

              <Link
                to="/history"
                className="px-5 py-4 hover:bg-orange-500/10"
              >
                🕒 History
              </Link>

              <Link
                to="/profile"
                className="px-5 py-4 hover:bg-purple-500/10"
              >
                👤 Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-left px-5 py-4 hover:bg-red-500/10"
              >
                🚪 Logout
              </button>

            </div>
          </div>
        )}
      </header>

      {/* === 🏠 Hero Section === */}
      <main className="
flex
flex-col
items-center
justify-center
min-h-screen
px-4
sm:px-6
pt-28
md:pt-32
text-center
">
        <h1 className="text-3xl
sm:text-4xl
md:text-5xl
lg:text-6xl font-extrabold mb-6 gradient-text">
          Welcome to Moodify 🎧
        </h1>
        <p className="text-sm
sm:text-base
md:text-lg
lg:text-xl text-gray-300 max-w-2xl mx-auto mb-12">
          Your personal AI music companion. <br />
          Choose your mood or express it — Moodify will tune the perfect vibe for you.
        </p>

        <div className="grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-6
md:gap-8
w-full
max-w-6xl max-w-6xl mx-auto">
          <div className="glass-card
text-center
p-6
md:p-8
hover:scale-[1.03]
transition-all
duration-300
hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-cyan-400">🎼 Manual Selection</h2>
            <p className="text-sm md:text-base text-gray-300 mb-6">Choose your favorite genres, artists, or moods.</p>
            <Link to="/manual-selection" className="px-5 md:px-6
py-2.5
text-sm
md:text-base
font-medium bg-cyan-500 hover:bg-cyan-600 rounded-full transition-all">
              Go to Manual Selection
            </Link>
          </div>

          <div className="glass-card
text-center
p-6
md:p-8
hover:scale-[1.03]
transition-all
duration-300
hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-pink-400">😊 Mood Detection</h2>
            <p className="text-sm md:text-base text-gray-300 mb-6">
              Let Moodify detect your mood using expressions.
            </p>
            <Link to="/mood-detection" className="px-5 md:px-6
py-2.5
text-sm
md:text-base
font-medium bg-pink-500 hover:bg-pink-600 rounded-full transition-all">
              Detect Mood
            </Link>
          </div>

          <div className="glass-card
text-center
p-6
md:p-8
hover:scale-[1.03]
transition-all
duration-300
hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 text-orange-400">💬 Text Emotion</h2>
            <p className="text-sm md:text-base text-gray-300 mb-6">
              Chat with AI — Moodify reads your mood through words.
            </p>
            <Link to="/chat-mood" className="px-5 md:px-6
py-2.5
text-sm
md:text-base
font-medium bg-orange-500 hover:bg-orange-600 rounded-full transition-all">
              Chat with AI
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;