import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const ManualSelection = () => {
  const [genre, setGenre] = useState("");
  const [artist, setArtist] = useState("");
  const [mood, setMood] = useState("");
  const navigate = useNavigate();

  const handleRecommend = () => {
    if (!genre && !artist && !mood) {
      alert("Please select at least one preference!");
      return;
    }

    const selectedMood = mood || "Custom";
    navigate("/recommendations", {
      state: {
        source: "manual", // ✅ identifies source page
        mood: selectedMood,
        genre,
        artist,
      },
    });
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 py-8">
        {/* 🎼 Manual Selection Card */}
        <div className="relative z-10 w-full max-w-2xl glass-card p-8 text-center backdrop-blur-2xl border border-white/10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 gradient-text">
            🎼 Manual Selection
          </h2>
          <p className="text-gray-300 mb-8">
            Choose your favorite <span className="text-cyan-400">genre</span>,{" "}
            <span className="text-pink-400">artist</span>, or{" "}
            <span className="text-orange-400">mood</span> — and let Moodify tune the
            perfect vibe!
          </p>

          {/* 🎛️ Selection Form */}
          <div className="space-y-6 text-left">
            {/* Genre Dropdown */}
            <div>
              <label className="block text-gray-300 mb-2 text-lg">
                🎵 Select Genre
              </label>
              <div className="rounded-lg p-[2px] bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400">
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0a1a]/90 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
                >
                  <option className="bg-[#111] text-white">
                    -- Choose Genre --
                  </option>
                  <option className="bg-[#111] text-white">Pop</option>
                  <option className="bg-[#111] text-white">Rock</option>
                  <option className="bg-[#111] text-white">Hip-Hop</option>
                  <option className="bg-[#111] text-white">Jazz</option>
                  <option className="bg-[#111] text-white">Classical</option>
                  <option className="bg-[#111] text-white">Lo-Fi</option>
                  <option className="bg-[#111] text-white">EDM</option>
                </select>
              </div>
            </div>

            {/* Artist Input */}
            <div>
              <label className="block text-gray-300 mb-2 text-lg">
                🎤 Favorite Artist
              </label>
              <div className="rounded-lg p-[2px] bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400">
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter artist name..."
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0a1a]/90 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
            </div>

            {/* Mood Dropdown */}
            <div>
              <label className="block text-gray-300 mb-2 text-lg">
                😊 Choose Mood
              </label>
              <div className="rounded-lg p-[2px] bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400">
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[#0a0a1a]/90 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400 cursor-pointer"
                >
                  <option className="bg-[#111] text-white">
                    -- Select Mood --
                  </option>
                  <option className="bg-[#111] text-white">Happy</option>
                  <option className="bg-[#111] text-white">Sad</option>
                  <option className="bg-[#111] text-white">Calm</option>
                  <option className="bg-[#111] text-white">Energetic</option>
                  <option className="bg-[#111] text-white">Romantic</option>
                </select>
              </div>
            </div>
          </div>

          {/* 🔘 Buttons Row (Side by Side) */}
          <div className="flex justify-center gap-6 mt-10 animate-fadeIn flex-wrap">
            <button
              onClick={handleRecommend}
              className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105 transition-transform shadow-[0_0_25px_rgba(255,0,255,0.3),0_0_45px_rgba(0,255,255,0.3)]"
            >
              Recommend Songs 🎶
            </button>

            <Link
              to="/home"
              className="px-8 py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all"
            >
              ⬅ Back to Home
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ManualSelection;