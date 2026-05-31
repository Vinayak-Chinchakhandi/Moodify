// src/components/PlaylistCard.jsx
import React from "react";
import { Play, Pause, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ title, cover, description, onPlay, song, playlist = null, showDelete = false, onDelete }) => {
  const navigate = useNavigate();

  const resolvedTitle = title || song?.title || song?.name || "Unknown";
  const resolvedCover = cover || song?.thumbnail || song?.cover || "";
  const resolvedDescription = description || song?.artist || song?.description || "";

  const dispatchPlay = (s) => {
    try {
      const pl = Array.isArray(playlist) && playlist.length > 0 ? playlist : song ? [song] : [];
      const idx = pl.findIndex((x) => x.videoId === s.videoId);
      window.dispatchEvent(new CustomEvent("moodify-play", { detail: { song: s, playlist: pl, index: idx >= 0 ? idx : 0 } }));
    } catch (e) {
      navigate("/stream", { state: { song: s } });
    }
  };

  const handleContainerClick = () => {
    if (onPlay) return onPlay();
    if (song && song.videoId) {
      if (!song.videoId || song.videoId.trim() === "") {
        console.warn("PlaylistCard play ignored: invalid videoId", song);
        return;
      }
      dispatchPlay(song);
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (onPlay) return onPlay();
    if (song && song.videoId) {
      if (!song.videoId || song.videoId.trim() === "") {
        console.warn("Play click ignored: invalid videoId", song);
        return;
      }
      dispatchPlay(song);
    }
  };

  const isPlaying = typeof window !== "undefined" && window.MoodifyCurrentVideoId === song?.videoId;

  return (
    <div
      className="
  group
  relative
  w-full
  max-w-[320px]
  bg-white/5
  rounded-2xl
  overflow-hidden
  transition-all
  duration-300
  hover:scale-105
  hover:shadow-[0_0_35px_rgba(255,0,255,0.3)]
  cursor-pointer
  "
    >
      <div className="relative w-full h-48 sm:h-48 overflow-hidden">
        {resolvedCover ? (
          <img src={resolvedCover} alt={resolvedTitle} className={`object-cover w-full h-full transition-transform duration-500 ${isPlaying ? "scale-105" : "group-hover:scale-110"}`} />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-4xl">🎵</div>
        )}

        {showDelete && onDelete && (
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="absolute top-2 right-2 z-20 p-2 rounded-full bg-black/60 hover:bg-red-600 transition-colors" title="Remove">
            <Trash size={16} className="text-white" />
          </button>
        )}

        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <button className="p-4 rounded-full bg-black/70 text-white hover:bg-black/80 transition" onClick={handlePlayClick}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col items-start gap-1">
        <h3 className="text-base
sm:text-lg font-semibold gradient-text">{resolvedTitle}</h3>
        <p className="text-gray-400 text-xs
sm:text-sm line-clamp-2">{resolvedDescription}</p>
      </div>

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