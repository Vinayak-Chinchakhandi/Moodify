import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import PlaylistCard from "../components/PlaylistCard";
import AudioPlayer from "../components/AudioPlayer";

const Playlists = () => {
  // 🎧 Temporary mock playlists (replace with Firebase data later)
  const playlists = [
    {
      id: 1,
      name: "Happy Vibes",
      mood: "Happy",
      songs: [
        { id: 1, title: "Sunny Day", artist: "VibesOnly", src: "/assets/music/happy.mp3" },
        { id: 2, title: "Smiles", artist: "GoodMood", src: "/assets/music/happy2.mp3" },
      ],
      image: "/assets/covers/happy.jpg",
    },
    {
      id: 2,
      name: "Chill Evenings",
      mood: "Relaxed",
      songs: [
        { id: 3, title: "Lofi Lane", artist: "ChillHop", src: "/assets/music/lofi.mp3" },
        { id: 4, title: "Night Breeze", artist: "CalmBeat", src: "/assets/music/lofi2.mp3" },
      ],
      image: "/assets/covers/lofi.jpg",
    },
    {
      id: 3,
      name: "Focus Flow",
      mood: "Calm",
      songs: [
        { id: 5, title: "Zen Code", artist: "AIVA", src: "/assets/music/calm.mp3" },
        { id: 6, title: "Concentration", artist: "MindState", src: "/assets/music/calm2.mp3" },
      ],
      image: "/assets/covers/calm.jpg",
    },
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24 text-white">
        <div className="relative z-10 w-full max-w-6xl glass-card p-10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)]">
          {/* 🎶 Title Section */}
          <h2 className="text-4xl font-extrabold mb-4 gradient-text">
            Your Playlists 🎶
          </h2>

          <p className="text-gray-300 text-lg mb-10">
            Create, customize, and organize playlists for every mood and moment.
          </p>

          {/* 📂 Playlists Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} song={playlist} />
            ))}
          </div>

          {/* 🎧 Audio Player Preview */}
          <div className="flex justify-center mb-10">
            <AudioPlayer playlist={playlists[0].songs} />
          </div>

          {/* 🏠 Back to Home Button */}
          <Link
            to="/home"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform"
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Playlists;
