import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import introVideo from "../assets/intro.mp4";
import logo from "../assets/logo.png";

const Intro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [navigated, setNavigated] = useState(false);

  // ✅ Reset intro when revisited
  useEffect(() => {
    setStarted(false);
    setFadeOut(false);
    setNavigated(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, [location.key]);

  const startVideo = async () => {
    try {
      setStarted(true);
      const video = videoRef.current;
      if (video) {
        video.muted = false;
        video.loop = false;
        video.currentTime = 0;
        await video.play();
      }
    } catch (error) {
      console.error("Autoplay blocked or playback failed:", error);
    }
  };

  const navigateToLogin = () => {
    if (!navigated) {
      setNavigated(true);
      setFadeOut(true);
      setTimeout(() => navigate("/login"), 1200);
    }
  };

  // Auto skip after video or timeout
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnd = () => navigateToLogin();
    video.addEventListener("ended", handleEnd);

    const backupTimer = setTimeout(() => navigateToLogin(), 10000);
    return () => {
      video.removeEventListener("ended", handleEnd);
      clearTimeout(backupTimer);
    };
  }, [started]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,#0a0a1a,#000)] z-[9999] transition-opacity duration-[1500ms] ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {!started ? (
        <>
          {/* 🌌 Floating Particles */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full opacity-40 animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  background:
                    "radial-gradient(circle, #00ffff 0%, #ff00cc 80%)",
                  animationDelay: `${Math.random() * 4}s`,
                }}
              ></div>
            ))}
          </div>

          {/* 🎵 Logo Section */}
          <div
            className="relative z-10 flex flex-col items-center justify-center gap-8 animate-fadeInUp"
            onClick={startVideo}
          >
            {/* ✨ Glowing Aura */}
            <div className="absolute w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle,rgba(0,255,255,0.5),rgba(255,0,204,0.25),transparent)] blur-3xl animate-pulseSlow" />

            <img
              src={logo}
              alt="Moodify Logo"
              className="w-80 h-80 rounded-full object-cover transition-transform duration-300 hover:scale-105 animate-logoGlow relative z-10 cursor-pointer"
            />

            {/* 🌈 Shimmer Text */}
            <h1 className="text-2xl md:text-3xl font-semibold uppercase tracking-wider select-none bg-gradient-to-r from-cyan-400 via-pink-500 to-orange-400 bg-[length:200%_auto] animate-shineText bg-clip-text text-transparent">
              Tap to Begin Experience
            </h1>
          </div>

          {/* 🕹 Skip Intro Button (looks elegant, bottom-right) */}
          <button
            onClick={navigateToLogin}
            className="absolute bottom-10 right-10 px-6 py-2 rounded-full text-sm bg-white/10 hover:bg-white/20 text-gray-300 border border-white/20 transition-all backdrop-blur-sm shadow-lg"
          >
            Skip Intro ⏭
          </button>
        </>
      ) : (
        // 🎥 Video Section
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover bg-black z-10 animate-videoFadeIn"
          style={{
            filter: "brightness(1.05) contrast(1.15) saturate(1.05)",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            willChange: "transform, opacity, filter",
          }}
          playsInline
          preload="auto"
          autoPlay
        >
          <source src={introVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* ✨ Animations */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-25px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(0px) scale(1); opacity: 0.4; }
        }

        @keyframes pulseSlow {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }

        @keyframes shineText {
          to { background-position: 200% center; }
        }

        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1.5s ease-out forwards;
        }

        .animate-shineText {
          animation: shineText 4s linear infinite;
        }

        .animate-pulseSlow {
          animation: pulseSlow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Intro;