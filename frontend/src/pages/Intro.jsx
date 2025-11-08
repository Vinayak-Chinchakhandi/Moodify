import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Intro.css";
import introVideo from "../assets/intro.mp4";
import logo from "../assets/logo.png";

const Intro = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [navigated, setNavigated] = useState(false);

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
      setTimeout(() => navigate("/login"), 1000);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnd = () => navigateToLogin();

    // Fallback: manually check time every 300ms
    const interval = setInterval(() => {
      if (video && started && video.duration > 0) {
        const remaining = video.duration - video.currentTime;
        if (remaining < 0.25) navigateToLogin();
      }
    }, 300);

    video.addEventListener("ended", handleEnd);

    // Backup timer — ensures redirect even if all else fails
    const backupTimer = setTimeout(() => navigateToLogin(), 15000);

    return () => {
      video.removeEventListener("ended", handleEnd);
      clearInterval(interval);
      clearTimeout(backupTimer);
    };
  }, [started]);

  return (
    <div className={`intro-container ${fadeOut ? "fade-out" : ""}`}>
      {!started ? (
        <div className="intro-start-screen" onClick={startVideo}>
          <img src={logo} alt="Moodify Logo" className="intro-logo" />
          <h1 className="intro-start-text">Tap to Begin Experience</h1>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="intro-video"
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
