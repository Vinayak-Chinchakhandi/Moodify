import { fetchYouTubeSongs } from "../services/youtube.service.js";

const moodKeywords = {
  Happy: ["happy songs", "feel good music", "uplifting pop"],
  Sad: ["sad songs", "emotional music", "heartbreak songs"],
  Calm: ["lofi beats", "calm music", "relaxing instrumental"],
  Energetic: ["edm mix", "workout playlist", "high energy music"],
  Romantic: ["romantic songs", "love hits", "soft romantic tracks"],
  Neutral: ["top hits mix", "popular playlist"]
};

export const getMoodSongs = async (req, res) => {
  try {
    const { mood, pageToken } = req.query;

    const list = moodKeywords[mood] || moodKeywords["Neutral"];
    const query = list[Math.floor(Math.random() * list.length)];

    const data = await fetchYouTubeSongs(query, 20, pageToken || "");

    res.json({
      mood,
      query,
      items: data.items,
      nextPageToken: data.nextPageToken || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch songs" });
  }
};