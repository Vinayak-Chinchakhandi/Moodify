import React from "react";
import { Play } from "lucide-react";

const PlaylistCard = ({ title, cover, description, onPlay }) => {
  return (
    <div
      className="group relative w-64 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(255,0,255,0.3)] cursor-pointer"
      onClick={onPlay}
    >
      {/* 🎵 Cover Art */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={cover}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        {/* 🔘 Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            className="p-4 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 shadow-[0_0_25px_rgba(255,0,255,0.4)] hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
          >
            <Play size={28} className="text-white" />
          </button>
        </div>
      </div>

      {/* 🎶 Info Section */}
      <div className="p-4 flex flex-col items-start gap-1">
        <h3 className="text-lg font-semibold gradient-text">{title}</h3>
        <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
      </div>

      {/* ✨ Gradient Text + Style */}
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

export default PlaylistCard;
