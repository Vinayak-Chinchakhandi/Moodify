import { useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

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
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-white px-6 py-10 text-center">
        {/* 🎧 Recommendation Container */}
        <div className="relative z-10 w-full max-w-4xl glass-card p-10 backdrop-blur-2xl border border-white/10 rounded-2xl">
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
                <p className="text-gray-300 text-sm">
                  Artist Name — Genre Type 🎧
                </p>
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
      </div>
    </PageWrapper>
  );
};

export default Recommendations;