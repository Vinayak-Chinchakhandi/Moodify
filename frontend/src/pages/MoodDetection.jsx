import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const MoodDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [mood, setMood] = useState(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // 🎥 Start webcam and detection simulation
  const startDetection = async () => {
    setIsDetecting(true);
    setMood(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Simulated AI detection (you can replace this later with real model)
      setTimeout(() => {
        const moods = ["Happy", "Sad", "Calm", "Angry", "Surprised"];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        setMood(randomMood);
        setIsDetecting(false);
      }, 4000);
    } catch (error) {
      alert("Camera access denied or unavailable.");
      console.error(error);
      setIsDetecting(false);
    }
  };

  const handleGoToRecommendations = () => {
    if (mood) {
      navigate("/recommendations", {
        state: {
          source: "mood",  // ✅ Added source
          mood
        }
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,#0a0a1a,#000)] text-white overflow-hidden px-4 py-8 transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,0,255,0.3),0_0_65px_rgba(0,255,255,0.3)]">
      {/* 🌌 Particle Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background:
                "radial-gradient(circle, rgba(0,255,255,0.9) 0%, rgba(255,0,204,0.9) 80%)",
              animation: `float ${5 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* 🎭 Mood Detection Container */}
      <div className="relative z-10 w-full max-w-3xl glass-card p-8 text-center backdrop-blur-2xl border border-white/10">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 gradient-text">
          Facial Mood Detection 🎭
        </h2>
        <p className="text-gray-300 mb-8">
          Use your webcam to detect your mood in real time.
          Once detected, you can move to your personalized music recommendations!
        </p>

        {/* 🎥 Webcam Preview */}
        <div className="relative w-full aspect-video bg-black border border-white/10 rounded-2xl overflow-hidden mb-6 shadow-[0_0_25px_rgba(255,0,255,0.2)]">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          ></video>
          {isDetecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <p className="text-cyan-400 text-lg animate-pulse">
                Detecting mood... please wait ✨
              </p>
            </div>
          )}
        </div>

        {/* 🎯 Detected Mood Display */}
        {mood && (
          <div className="mb-6 animate-fadeIn">
            <h3 className="text-2xl font-semibold text-cyan-300">
              Detected Mood: <span className="text-pink-400">{mood}</span>
            </h3>
          </div>
        )}

        {/* 🔘 Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 mt-6">
          {!isDetecting && !mood && (
            <button
              onClick={startDetection}
              className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105 transition-transform shadow-[0_0_25px_rgba(255,0,255,0.3),0_0_45px_rgba(0,255,255,0.3)]"
            >
              Start Detection 🎥
            </button>
          )}

          {mood && (
            <button
              onClick={handleGoToRecommendations}
              className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105 transition-transform shadow-[0_0_25px_rgba(255,0,255,0.3),0_0_45px_rgba(0,255,255,0.3)]"
            >
              Move to Recommendations 🎶
            </button>
          )}
        </div>

        {/* 🔙 Back Button (Moodify-styled) */}
        <div className="flex justify-center mt-8 animate-fadeIn">
          <Link
            to="/home"
            className="px-8 py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all"
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>

      {/* ✨ Animation Keyframes */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-25px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(0px) scale(1); opacity: 0.4; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MoodDetection;
