import React, { useRef, useEffect } from "react";

const WebcamCapture = ({ onFrame, stopAfterDetection }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null); // reuse canvas
  const intervalRef = useRef(null);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent) && window.innerWidth < 1024;
  const constraints = {
    video: isMobile
      ? { facingMode: "user", width: { ideal: 720 }, height: { ideal: 1280 } }
      : { width: { ideal: 640 }, height: { ideal: 480 } },
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;

        // create canvas once
        canvasRef.current = document.createElement("canvas");

        // start interval to send frames
        intervalRef.current = setInterval(() => {
          if (!videoRef.current) return;

          const video = videoRef.current;
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const continueCapture = onFrame?.(canvas); // if onFrame returns false, stop interval

          if (stopAfterDetection && continueCapture === false) {
            clearInterval(intervalRef.current);
          }
        }, 500);
      } catch (err) {
        console.error("Camera access denied:", err);
        alert("Unable to access webcam. Please allow permissions.");
      }
    };

    startCamera();

    return () => {
      // stop camera and interval
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

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
