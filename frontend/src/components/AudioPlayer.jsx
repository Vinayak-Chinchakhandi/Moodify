import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Repeat } from "lucide-react";

const AudioPlayer = ({ playlist }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loop, setLoop] = useState(false);

  const audioRef = useRef(null);
  const currentSong = playlist[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

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
  }, [currentIndex, loop]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
    setProgress(0);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(e.target.value);
  };

  const toggleLoop = () => setLoop((prev) => !prev);

  // Format time as mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md glass-card p-6 rounded-2xl border border-white/10 text-white backdrop-blur-2xl shadow-[0_0_25px_rgba(255,0,255,0.2)] hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] transition-all">
      {/* 🎵 Song Info */}
      <h2 className="text-2xl font-bold mb-1 gradient-text text-center">{currentSong.title}</h2>
      <p className="text-gray-400 text-sm mb-4">{currentSong.artist}</p>

      {/* 🎶 Progress Bar */}
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
        className="w-full accent-cyan-400 cursor-pointer"
      />

      {/* ⏱ Time Display */}
      <div className="flex justify-between text-xs text-gray-400 w-full mt-1">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* 🔘 Controls */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button onClick={handlePrev} className="hover:scale-110 transition-transform text-cyan-400">
          <SkipBack size={26} />
        </button>
        <button
          onClick={handlePlayPause}
          className="bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 p-4 rounded-full shadow-[0_0_25px_rgba(255,0,255,0.3)] hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause size={30} /> : <Play size={30} />}
        </button>
        <button onClick={handleNext} className="hover:scale-110 transition-transform text-pink-400">
          <SkipForward size={26} />
        </button>
      </div>

      {/* 🔁 Loop Toggle */}
      <button
        onClick={toggleLoop}
        className={`mt-4 text-sm flex items-center gap-2 ${
          loop ? "text-pink-400" : "text-gray-400"
        } hover:text-cyan-400 transition-colors`}
      >
        <Repeat size={18} />
        {loop ? "Loop On" : "Loop Off"}
      </button>

      {/* 🎧 Audio Element */}
      <audio ref={audioRef} src={currentSong.src} preload="metadata" />

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 25px rgba(255, 0, 255, 0.15);
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
