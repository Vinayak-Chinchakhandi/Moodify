import React, { useRef, useEffect } from "react";

// mirror: if true, preview will be mirrored (user-facing). Default false shows natural orientation.
const WebcamCapture = ({ onFrame, mirror = false }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent) && window.innerWidth < 1024;
  const constraints = {
    video: isMobile
      ? { facingMode: "user", width: { ideal: 720 }, height: { ideal: 1280 } }
      : { width: { ideal: 640 }, height: { ideal: 480 } },
  };

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (!mounted) return;
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;

        // Set preview transform explicitly
        if (videoRef.current) videoRef.current.style.transform = mirror ? "scaleX(-1)" : "none";

        canvasRef.current = document.createElement("canvas");

        intervalRef.current = setInterval(() => {
          if (!videoRef.current) return;

          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          const ctx = canvas.getContext("2d");

          if (mirror) {
            ctx.save();
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.restore();
          } else {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          }

          canvas.toBlob((blob) => {
            if (blob && onFrame) onFrame(blob);
          }, "image/jpeg");
        }, 1000); // capture every 1 sec
      } catch (err) {
        console.error("Camera access denied:", err);
        alert("Unable to access webcam. Please allow permissions.");
      }
    };

    // Handler to stop camera from other parts of the app
    const stopHandler = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (videoRef.current) {
        try { videoRef.current.srcObject = null; } catch (e) {}
        videoRef.current.style.transform = "none";
      }
      canvasRef.current = null;
    };

    window.addEventListener("moodify-stop-camera", stopHandler);

    startCamera();

    return () => {
      mounted = false;
      window.removeEventListener("moodify-stop-camera", stopHandler);
      if (streamRef.current)
        streamRef.current.getTracks().forEach((track) => track.stop());
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mirror, onFrame]);

  return (
    <div className="relative w-full max-w-md rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full aspect-video object-cover rounded-xl"
      />
    </div>
  );
};

export default WebcamCapture;