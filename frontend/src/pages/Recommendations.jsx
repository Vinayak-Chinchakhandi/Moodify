import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Recommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const { mood, genre, artist, source } = state || {};

  // Dynamic Back Button
  const handleBack = () => {
    if (source === "manual") navigate("/manual-selection");
    else if (source === "mood") navigate("/mood-detection");
    else if (source === "chat") navigate("/chat-mood");
    else navigate("/home");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,#0a0a1a,#000)] text-white overflow-hidden px-6 py-10 transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,0,255,0.3),0_0_65px_rgba(0,255,255,0.3)]">
      
      {/* 🌌 Particle Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background:
                "radial-gradient(circle, rgba(0,255,255,0.9) 0%, rgba(255,0,204,0.9) 80%)",
              animation: `float ${5 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* 🎧 Recommendation Container */}
      <div className="relative z-10 w-full max-w-4xl glass-card p-10 text-center backdrop-blur-2xl border border-white/10 rounded-2xl">
        <h2 className="text-4xl font-extrabold mb-6 gradient-text">
          Your Recommended Songs 🎵
        </h2>

        <p className="text-gray-300 mb-8">
          Based on your{" "}
          {genre ? (
            <span className="text-cyan-400">Genre: {genre}</span>
          ) : mood ? (
            <span className="text-pink-400">Mood: {mood}</span>
          ) : (
            <span className="text-orange-400">Preferences</span>
          )}{" "}
          {artist && (
            <span>
              and Artist: <span className="text-purple-400">{artist}</span>
            </span>
          )}
        </p>

        {/* 🎶 Recommended Songs Mock Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                Song {i + 1}
              </h3>
              <p className="text-gray-300 text-sm">Artist Name — Genre Type 🎧</p>
            </div>
          ))}
        </div>

        {/* 🔘 Back Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleBack}
            className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105 transition-transform shadow-[0_0_25px_rgba(255,0,255,0.3),0_0_45px_rgba(0,255,255,0.3)]"
          >
            ⬅ Back
          </button>
        </div>
      </div>

      {/* ✨ Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-25px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(0px) scale(1); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Recommendations;
