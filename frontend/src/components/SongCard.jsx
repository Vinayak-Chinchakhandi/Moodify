import React from "react";
import { Play, Pause } from "lucide-react";

const SongCard = ({ title, artist, cover, isPlaying, onPlayPause }) => {
  return (
    <div
      className="group relative flex flex-col items-center justify-center w-52 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_25px_rgba(255,0,255,0.15)] hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] transition-all duration-300 hover:scale-105 cursor-pointer"
      onClick={onPlayPause}
    >
      {/* 🎵 Cover Art */}
      <div className="relative w-40 h-40 rounded-xl overflow-hidden mb-3">
        <img
          src={cover}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        {/* 🔘 Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayPause?.();
            }}
            className="p-3 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 shadow-[0_0_25px_rgba(255,0,255,0.3)] hover:scale-110 transition-transform"
          >
            {isPlaying ? (
              <Pause size={26} className="text-white" />
            ) : (
              <Play size={26} className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* 🎶 Info */}
      <div className="flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold gradient-text truncate max-w-[160px]">
          {title}
        </h3>
        <p className="text-gray-400 text-sm">{artist}</p>
      </div>

      {/* ✨ Gradient Text Styling */}
      <style>{`
        .gradient-text {
          background: linear-gradient(to right, #00ffff, #ff00ff, #ff6600);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default SongCard;





//usage
// import SongCard from "./SongCard";

// export default function SongList() {
//   const songs = [
//     {
//       title: "Neon Nights",
//       artist: "Luna Waves",
//       cover: "/images/neon-nights.jpg",
//     },
//     {
//       title: "Cyber Pulse",
//       artist: "DJ Nova",
//       cover: "/images/cyber-pulse.jpg",
//     },
//   ];

//   return (
//     <div className="flex flex-wrap gap-6 justify-center">
//       {songs.map((song, i) => (
//         <SongCard
//           key={i}
//           {...song}
//           isPlaying={false}
//           onPlayPause={() => console.log("Play:", song.title)}
//         />
//       ))}
//     </div>
//   );
// }
