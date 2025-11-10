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

  // ✅ Reset intro every time route changes (e.g. logo clicked)
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

  // Auto skip once video ends or timeout
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnd = () => navigateToLogin();

    const interval = setInterval(() => {
      if (video && started && video.duration > 0) {
        const remaining = video.duration - video.currentTime;
        if (remaining < 0.25) navigateToLogin();
      }
    }, 300);

    video.addEventListener("ended", handleEnd);
    const backupTimer = setTimeout(() => navigateToLogin(), 15000);

    return () => {
      video.removeEventListener("ended", handleEnd);
      clearInterval(interval);
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
          {/* 🌌 Floating Particles (below content) */}
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

          {/* 🎵 Logo + Tap to Begin */}
          <div
            className="relative z-10 flex flex-col items-center justify-center gap-8 cursor-pointer animate-fadeIn"
            onClick={startVideo}
          >
            <img
              src={logo}
              alt="Moodify Logo"
              className="w-80 h-80 rounded-full object-cover transition-transform duration-300 hover:scale-105 animate-logoGlow"
            />
            <h1
              className="text-2xl md:text-3xl font-semibold uppercase tracking-wider select-none gradient-text"
            >
              Tap to Begin Experience
            </h1>
          </div>
        </>
      ) : (
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
    </div>
  );
};

export default Intro;
