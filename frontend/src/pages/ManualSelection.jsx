import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import { fetchArtists } from "../services/artistApi";

const ManualSelection = () => {
  const [genre, setGenre] = useState("");
  const [artist, setArtist] = useState("");
  const [mood, setMood] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  const handleRecommend = () => {
    if (!genre && !artist && !mood) {
      alert("Please select at least one preference!");
      return;
    }

    // mood is required for search API; if not selected, use "Neutral"
    const selectedMood = mood && mood !== "-- Select Mood --" ? mood : "Neutral";
    const selectedGenre = genre && genre !== "-- Choose Genre --" ? genre : "";

    navigate("/recommendations", {
      state: {
        source: "manual",
        mood: selectedMood,
        genre: selectedGenre,
        artist: artist || "",
      },
    });
  };

  return (
    <div
      className="
flex
flex-col
items-center
justify-center
min-h-screen
text-white
px-3
sm:px-4
md:px-6
py-6
sm:py-8
"
    >
      <div className="
relative
z-10
w-full
max-w-2xl
glass-card
p-5
sm:p-6
md:p-8
text-center
backdrop-blur-2xl
border
border-white/10
rounded-2xl
sm:rounded-3xl
">
        <h2
          className="
text-2xl
sm:text-3xl
md:text-4xl
font-extrabold
mb-6
gradient-text
"
        >          🎼 Manual Selection
        </h2>

        <p
          className="
text-sm
sm:text-base
text-gray-300
mb-8
leading-relaxed
"
        >          Choose your favorite <span className="text-cyan-400">genre</span>,{" "}
          <span className="text-pink-400">artist</span>,{" "}
          <span className="text-orange-400">mood</span> — and let Moodify tune
          the perfect vibe!
        </p>

        <div className="space-y-6 text-left">
          {/* 🎵 Genre Dropdown */}
          <Dropdown
            label="🎵 Select Genre"
            value={genre}
            onChange={setGenre}
            options={[
              "-- Choose Genre --",
              "Pop",
              "Rock",
              "Hip-Hop",
              "Jazz",
              "Classical",
              "Lo-Fi",
              "EDM",
            ]}
          />

          {/* 🎤 Artist Input + Auto Suggestions */}
          <div className="relative">
            <label className="block text-gray-300 mb-2 text-base sm:text-lg">
              🎤 Favorite Artist
            </label>

            <div className="rounded-lg p-[2px] bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400">
              <input
                type="text"
                value={artist}
                onChange={async (e) => {
                  const value = e.target.value;
                  setArtist(value);

                  const results = await fetchArtists(value);
                  setSuggestions(results);
                }}
                placeholder="Enter artist name..."
                className="
w-full
px-4
py-3
text-sm
sm:text-base
rounded-lg
bg-[#0a0a1a]/90
text-white
placeholder-gray-300
focus:outline-none
focus:ring-2
focus:ring-pink-400
"
              />
            </div>

            {/* AUTO SUGGEST DROPDOWN */}
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 bg-[#0a0a1a] border border-white/10 rounded-lg max-h-40 sm:max-h-48 overflow-y-auto z-50">
                {suggestions.map((item) => (
                  <li
                    key={item.artistId}
                    onClick={() => {
                      setArtist(item.artistName);
                      setSuggestions([]);
                    }}
                    className="
px-4
py-2
text-sm
sm:text-base
cursor-pointer
hover:bg-white/10
text-gray-200
"
                  >
                    {item.artistName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 😊 Mood Dropdown */}
          <Dropdown
            label="😊 Choose Mood"
            value={mood}
            onChange={setMood}
            options={[
              "-- Select Mood --",
              "Happy",
              "Sad",
              "Calm",
              "Energetic",
              "Romantic",
            ]}
          />
        </div>

        {/* 🔘 Buttons Row */}
        <div
          className="
flex
flex-col
sm:flex-row
justify-center
items-center
gap-4
sm:gap-6
mt-8
sm:mt-10
animate-fadeIn
"
        >
          <button
            onClick={handleRecommend}
            className="
w-full
sm:w-auto
px-6
sm:px-8
py-3
rounded-full
font-semibold
bg-gradient-to-r
from-cyan-500
via-pink-500
to-orange-400
hover:scale-105
transition-transform
shadow-[0_0_25px_rgba(255,0,255,0.3),0_0_45px_rgba(0,255,255,0.3)]
"
          >
            Find Songs 🎶
          </button>

          <Link
            to="/home"
            className="
w-full
sm:w-auto
px-6
sm:px-8
py-3
rounded-full
font-semibold
bg-white/10
border
border-white/20
hover:bg-white/20
text-gray-300
hover:text-cyan-400
transition-all
"
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManualSelection;
