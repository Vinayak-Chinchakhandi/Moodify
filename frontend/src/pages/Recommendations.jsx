import { useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import SongCard from "../components/SongCard";
import AudioPlayer from "../components/AudioPlayer";
import { useState } from "react";

const Recommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const { mood, genre, artist, source } = state || {};

  // 🔹 Mock recommended songs for now
  const [recommendedSongs] = useState([
    { id: 1, title: "Peaceful Mind", artist: "AIVA", cover: "/assets/covers/calm.jpg" },
    { id: 2, title: "Energetic Flow", artist: "DJ Vibe", cover: "/assets/covers/happy.jpg" },
    { id: 3, title: "Lo-Fi Dreams", artist: "ChillHop", cover: "/assets/covers/lofi.jpg" },
    { id: 4, title: "Romantic Sunset", artist: "Luna", cover: "/assets/covers/romantic.jpg" },
    { id: 5, title: "Jazz Vibes", artist: "SmoothJazz", cover: "/assets/covers/jazz.jpg" },
    { id: 6, title: "Classical Peace", artist: "Mozart", cover: "/assets/covers/classical.jpg" },
  ]);

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
        <div className="relative z-10 w-full max-w-5xl glass-card p-10 backdrop-blur-2xl border border-white/10 rounded-2xl">
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

          {/* 🎶 Recommended Songs Grid using SongCard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendedSongs.map((song) => (
              <SongCard
                key={song.id}
                title={song.title}
                artist={song.artist}
                cover={song.cover}
              />
            ))}
          </div>

          {/* 🔊 Audio Player centered */}
          <div className="mt-8 flex justify-center w-full">
            <div className="w-full max-w-lg">
              <div className="mx-auto">
                <AudioPlayer songs={recommendedSongs} />
              </div>
            </div>
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
