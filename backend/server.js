import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware.js";

import artistsRoutes from "./routes/artists.routes.js";
import moodRoutes from "./routes/mood.routes.js";
import textRoutes from "./routes/text.routes.js";
import youtubeRoutes from "./routes/youtube.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ROUTES
app.use("/api/artists", artistsRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/text", textRoutes);
app.use("/api/youtube", youtubeRoutes);

// GLOBAL ERROR HANDLER
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));