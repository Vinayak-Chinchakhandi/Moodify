import React, { useRef, useState, useEffect } from "react";

const WebcamCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [captured, setCaptured] = useState(null);
  const [streaming, setStreaming] = useState(false);

  // 🎥 Start camera on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        alert("Unable to access webcam. Please allow permissions.");
      }
    };

    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 📸 Capture snapshot
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setCaptured(imageData);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_25px_rgba(255,0,255,0.15)] hover:shadow-[0_0_40px_rgba(0,255,255,0.3)] transition-all duration-300 max-w-lg w-full text-white">
      <h2 className="text-2xl font-bold gradient-text">Webcam Capture</h2>

      {/* 🎥 Video Feed */}
      <div className="relative w-full flex justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`rounded-xl border border-white/10 w-full max-w-md aspect-video object-cover ${
            streaming ? "opacity-100" : "opacity-50"
          }`}
        />
        {!streaming && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Initializing camera...
          </div>
        )}
      </div>

      {/* 📸 Capture Button */}
      <button
        onClick={handleCapture}
        className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 shadow-[0_0_20px_rgba(255,0,255,0.3),0_0_40px_rgba(0,255,255,0.3)] hover:scale-105 transition-all duration-300 font-semibold"
      >
        Capture Photo
      </button>

      {/* 🖼️ Captured Image */}
      {captured && (
        <div className="mt-4 w-full flex flex-col items-center">
          <h3 className="text-lg text-gray-300 mb-2">Captured Image:</h3>
          <img
            src={captured}
            alt="Captured"
            className="rounded-xl border border-white/20 shadow-[0_0_25px_rgba(0,255,255,0.3)] max-w-md"
          />
        </div>
      )}

      {/* 🎨 Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

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

export default WebcamCapture;
