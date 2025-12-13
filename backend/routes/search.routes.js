import express from "express";
import { searchSongs, getMoreSongs } from "../controllers/search.controller.js";

const router = express.Router();

// POST /api/search/songs?mood=Happy&genre=Pop&artist=Taylor+Swift&languages=en,es&pageToken=...
router.get("/songs", searchSongs);

// GET /api/search/more?pageToken=...&mood=Happy&...
router.get("/more", getMoreSongs);

export default router;
