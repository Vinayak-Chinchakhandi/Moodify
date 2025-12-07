import { detectEmotionFromBuffer } from "../services/huggingface.service.js";

export const detectWebcamMood = async (req, res) => {
  try {
    if (!req.file) {
      console.error("No image file provided");
      return res.status(400).json({ error: "No image provided" });
    }

    console.log("Detecting mood from image buffer:", req.file.size, "bytes");

    const mood = await detectEmotionFromBuffer(req.file.buffer);

    console.log("Detected mood:", mood);

    return res.json({ mood });
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({ error: "Failed to detect mood", message: err.message });
  }
};