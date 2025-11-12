import React, { useState } from "react";
import { Play, Pause, Plus } from "lucide-react";

const SongCard = ({ title, artist, cover, isPlaying, onPlayPause, onAddToPlaylist }) => {
  const [showPlaylistInput, setShowPlaylistInput] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  const handleAdd = () => {
    if (!playlistName.trim()) return;
    onAddToPlaylist?.(playlistName.trim());
    setPlaylistName("");
    setShowPlaylistInput(false);
  };

  return (
    <div className="group relative flex flex-col items-center justify-center w-52 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_25px_rgba(255,0,255,0.15)] hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] transition-all duration-300 hover:scale-105 cursor-pointer">
      
      {/* 🎵 Cover Art */}
      <div className="relative w-40 h-40 rounded-xl overflow-hidden mb-3">
        <img
          src={cover}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); onPlayPause?.(); }}
            className="p-3 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 shadow-[0_0_25px_rgba(255,0,255,0.3)] hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause size={26} className="text-white" /> : <Play size={26} className="text-white" />}
          </button>
        </div>
      </div>

      {/* 🎶 Info */}
      <div className="flex flex-col items-center text-center mb-2">
        <h3 className="text-lg font-semibold gradient-text truncate max-w-[160px]">{title}</h3>
        <p className="text-gray-400 text-sm">{artist}</p>
      </div>

      {/* ➕ Add to Playlist */}
      <div>
        {showPlaylistInput ? (
          <div className="flex gap-1">
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Playlist name"
              className="px-2 py-1 rounded bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
            />
            <button
              onClick={handleAdd}
              className="p-1 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 text-white"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setShowPlaylistInput(true); }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 text-sm"
          >
            <Plus size={16} /> Playlist
          </button>
        )}
      </div>

    </div>
  );
};

export default SongCard;
