import express from "express";
import { getArtists } from "../controllers/artists.controller.js";

const router = express.Router();

router.get("/search", getArtists);

export default router;
