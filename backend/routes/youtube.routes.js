import express from "express";
import { getMoodSongs } from "../controllers/youtube.controller.js";

const router = express.Router();

router.get("/songs", getMoodSongs);

export default router;