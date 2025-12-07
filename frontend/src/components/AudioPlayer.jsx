import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, Heart } from "lucide-react";

const AudioPlayer = ({ playlist = [], onLike, onAddPlaylist }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const audioRef = useRef(null);

  const currentSong =
    playlist.length > 0 ? playlist[currentIndex] : { title: "No song", artist: "", src: "" };

  // Track when song changes and reset like state
  useEffect(() => {
    setIsLiked(currentSong.isLiked || false);
  }, [currentIndex, currentSong]);

  // handleNext stable callback
  const handleNext = useCallback(() => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  }, [playlist.length]);

  // ✅ useEffect always called (no conditional)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      // progress tracked but kept minimal for compact player
    };

    const handleLoadedMetadata = () => setDuration(audio.duration);

    const handleEnded = () => {
      if (loop) audio.play();
      else handleNext();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, loop, handleNext]);

  const handlePlayPause = () => {
    if (!currentSong.videoId) return;
    
    // Navigate to Stream page to play the song
    navigate("/stream", { state: { song: currentSong } });
    setIsPlaying(true);
  };

  // handleNext is declared above
  const handlePrev = () => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
  };

  const toggleLoop = () => setLoop((prev) => !prev);

  const handleLike = async () => {
    if (!currentSong.videoId || !onLike) return;
    try {
      await onLike(currentSong, !isLiked);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handlePlaylistAdd = () => {
    if (!currentSong.videoId || !onAddPlaylist) return;
    try {
      onAddPlaylist(currentSong);
    } catch (err) {
      console.error("Playlist add failed:", err);
    }
  };

  // formatTime intentionally removed - not used in compact player

  // ✅ Now we return early *after* hooks — safe for ESLint
  if (playlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-md glass-card p-6 rounded-2xl border border-white/10 text-white backdrop-blur-2xl text-center">
        <p className="text-gray-400 mb-2 text-lg">🎧 No songs to play</p>
        <p className="text-sm text-gray-500">
          Add songs to your playlist or favorites to start listening.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-sm glass-card p-3 rounded-lg border border-white/10 text-white backdrop-blur-2xl shadow-[0_0_15px_rgba(255,0,255,0.2)]">
      {/* 🎵 Song Info - Compact */}
      <h3 className="text-sm font-bold mb-0.5 gradient-text text-center truncate w-full">
        {currentSong.title}
      </h3>
      <p className="text-gray-400 text-xs mb-2 truncate w-full text-center">{currentSong.artist}</p>

      {/* 🔘 Controls - Compact */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <button onClick={handlePrev} className="hover:scale-110 transition-transform text-cyan-400">
          <SkipBack size={18} />
        </button>
        <button
          onClick={handlePlayPause}
          className="bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 p-2 rounded-full shadow-[0_0_15px_rgba(255,0,255,0.3)] hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={handleNext} className="hover:scale-110 transition-transform text-pink-400">
          <SkipForward size={18} />
        </button>
      </div>

      {/* ❤️ Like & Playlist Buttons - Compact */}
      {onLike && onAddPlaylist && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all ${
              isLiked
                ? "bg-pink-500/30 border border-pink-400 text-pink-300"
                : "bg-white/10 border border-white/20 text-gray-300 hover:border-pink-400"
            }`}
          >
            <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
            {isLiked ? "Liked" : "Like"}
          </button>
          <button
            onClick={handlePlaylistAdd}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-gray-300 hover:border-cyan-400 hover:text-cyan-300 transition-all"
          >
            + Add
          </button>
        </div>
      )}

      {/* 🎧 Audio Element - Hidden (YouTube videos don't have direct audio) */}
      <audio ref={audioRef} preload="metadata" />

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.15);
        }
        .gradient-text {
          background: linear-gradient(to right, #00ffff, #ff00ff, #ff6600);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default AudioPlayer;
