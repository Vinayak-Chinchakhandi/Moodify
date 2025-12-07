import express from "express";
import multer from "multer";
import { detectWebcamMood } from "../controllers/mood.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/mood/detect-webcam
router.post("/detect-webcam", upload.single("image"), detectWebcamMood);

export default router;