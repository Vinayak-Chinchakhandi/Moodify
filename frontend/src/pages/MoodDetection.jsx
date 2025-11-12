import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const MoodDetection = () => {
  const [mood, setMood] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const stopCameraRef = useRef(() => {}); // store stop function
  const navigate = useNavigate();

  // ========================================
  // WebcamCapture Component
  // ========================================
  const WebcamCapture = ({ onMoodDetected }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(document.createElement("canvas"));
    const intervalRef = useRef(null);
    const streamRef = useRef(null);
    const detectedMoodRef = useRef(false); // prevent multiple detections

    const isMobile = /Mobi|Android/i.test(navigator.userAgent) && window.innerWidth < 1024;
    const constraints = {
      video: isMobile
        ? { facingMode: "user", width: { ideal: 720 }, height: { ideal: 1280 } }
        : { width: { ideal: 640 }, height: { ideal: 480 } },
    };

    useEffect(() => {
      const stopCamera = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      stopCameraRef.current = stopCamera; // expose stop function

      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;

          intervalRef.current = setInterval(() => {
            if (detectedMoodRef.current) return;
            if (!videoRef.current) return;

            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frameData = canvas.toDataURL();

            onMoodDetected(frameData, () => {
              detectedMoodRef.current = true;
              stopCamera();
            });
          }, 1000);
        } catch (err) {
          console.error("Camera access denied:", err);
          alert("Unable to access webcam. Please allow permissions.");
        }
      };

      startCamera();
      return () => stopCamera(); // stop camera on unmount
    }, []);

    return (
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-w-md aspect-video object-cover rounded-xl"
      />
    );
  };

  // ========================================
  // Handle captured frame & detect mood
  // ========================================
  const handleFrame = async (frameDataURL, stopCallback) => {
    if (mood || isDetecting) return;

    setIsDetecting(true);

    try {
      // MOCK detection for now
      const moods = ["Happy", "Sad", "Calm", "Energetic", "Neutral"];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];

      setTimeout(() => {
        setMood(randomMood);
        setIsDetecting(false);
        stopCallback(); // stop camera after first detection
      }, 1000);
    } catch (err) {
      console.error("Mood detection failed:", err);
      setIsDetecting(false);
      stopCallback();
    }
  };

  // ========================================
  // Navigation handlers
  // ========================================
  const goToRecommendations = () => {
    stopCameraRef.current?.(); // stop camera immediately
    if (!mood) return;
    navigate("/recommendations", { state: { source: "mood", mood } });
  };

  const goBackHome = () => {
    stopCameraRef.current?.(); // stop camera immediately
    navigate("/home");
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 py-8">
        <div className="relative z-10 w-full max-w-4xl glass-card p-8 text-center backdrop-blur-2xl border border-white/10 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 gradient-text">
            Facial Mood Detection 🎭
          </h2>
          <p className="text-gray-300 mb-6">
            Use your webcam to detect your mood in real-time. After detection, you can get personalized music recommendations.
          </p>

          {/* Webcam */}
          <div className="flex justify-center mb-6">
            <WebcamCapture onMoodDetected={handleFrame} />
          </div>

          {isDetecting && <p className="text-gray-300 animate-pulse">Detecting mood... ✨</p>}

          {mood && (
            <div className="mb-4">
              <p className="text-lg text-cyan-300 mb-2 animate-fadeIn">
                Detected Mood: <span className="text-pink-400">{mood}</span>
              </p>
              <button
                onClick={goToRecommendations}
                className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105 transition-transform"
              >
                Recommend Songs 🎶
              </button>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={goBackHome}
              className="px-8 py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all"
            >
              ⬅ Back to Home
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out forwards;
        }
      `}</style>
    </PageWrapper>
  );
};

export default MoodDetection;
