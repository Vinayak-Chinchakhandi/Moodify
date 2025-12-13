import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware.js";
import path from "path";
import { fileURLToPath } from "url";

import artistsRoutes from "./routes/artists.routes.js";
import moodRoutes from "./routes/mood.routes.js";
import youtubeRoutes from "./routes/youtube.routes.js";
import searchRoutes from "./routes/search.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

app.use(cors());

// for JSON bodies
app.use(express.json({ limit: "10mb" }));

// for form-data (webcam image upload)
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/artists", artistsRoutes);
app.use("/api/mood", moodRoutes);        // <-- NEW webcam + multi-model mood detection
app.use("/api/youtube", youtubeRoutes);
app.use("/api/search", searchRoutes);    // <-- NEW unified search endpoint

// GLOBAL ERROR HANDLER
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));