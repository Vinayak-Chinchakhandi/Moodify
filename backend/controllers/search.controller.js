import { fetchYouTubeSongs } from "../services/youtube.service.js";
import { fetchMoodKeywords } from "../utils/moodKeywords.js";

/**
 * Search songs based on mood, genre, artist, and language preferences
 * Used by: Manual Selection, Mood Detection, Chat Mood
 * Input: mood, genre (optional), artist (optional), languages (array), pageToken (optional)
 * Output: normalized song list with video IDs and metadata
 * NOTE: When multiple languages provided, fetches songs in ALL languages
 */
export const searchSongs = async (req, res) => {
  try {
    const { mood, genre, artist, languages = [], pageToken = "" } = req.query;

    if (!mood) {
      return res.status(400).json({ error: "Mood is required" });
    }

    // Parse languages (comes as comma-separated string from frontend)
    let langArray = [];
    if (typeof languages === "string") {
      langArray = languages.split(",").filter(l => l.trim());
    } else if (Array.isArray(languages)) {
      langArray = languages;
    }

    // If no pageToken, fetch songs in all user languages
    // Otherwise, use the single-language approach for pagination
    let allSongs = [];
    let nextPageToken = null;

    if (!pageToken && langArray.length > 0) {
      // Fetch songs for each language and combine results
      const fetchPromises = langArray.map((lang) =>
        fetchYouTubeSongs(
          buildSearchQuery(mood, genre, artist, [lang]),
          Math.ceil(20 / langArray.length), // Distribute result count across languages
          ""
        ).catch(err => {
          console.warn(`⚠️ Failed to fetch for language ${lang}, returning empty`);
          return { items: [], nextPageToken: null };
        })
      );

      const results = await Promise.all(fetchPromises);

      // Combine and deduplicate songs from all languages
      const seenVideoIds = new Set();
      results.forEach((data) => {
        if (data && data.items) {
          data.items.forEach((item) => {
            if (!seenVideoIds.has(item.id.videoId)) {
              seenVideoIds.add(item.id.videoId);
              allSongs.push(item);
            }
          });
        }
      });

      // Keep first language's nextPageToken for pagination
      nextPageToken = results[0]?.nextPageToken || null;
    } else if (pageToken) {
      // For pagination, use the first language
      const query = buildSearchQuery(
        mood,
        genre,
        artist,
        langArray.length > 0 ? [langArray[0]] : []
      );
      try {
        const data = await fetchYouTubeSongs(query, 20, pageToken);
        allSongs = data.items;
        nextPageToken = data.nextPageToken || null;
      } catch (err) {
        console.warn("⚠️ Pagination fetch failed, returning empty results");
        allSongs = [];
      }
    } else {
      // No languages specified, fetch generic results
      const query = buildSearchQuery(mood, genre, artist, []);
      try {
        const data = await fetchYouTubeSongs(query, 20, pageToken);
        allSongs = data.items;
        nextPageToken = data.nextPageToken || null;
      } catch (err) {
        console.warn("⚠️ Generic fetch failed, returning empty results");
        allSongs = [];
      }
    }

    // Normalize results
    const normalizedSongs = allSongs.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
    }));

    res.json({
      mood,
      genre: genre || "Any",
      artist: artist || "Any",
      languages: langArray,
      items: normalizedSongs,
      nextPageToken: nextPageToken,
      total: normalizedSongs.length,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to search songs" });
  }
};

/**
 * Build YouTube search query from mood + genre + artist + language preferences
 */
function buildSearchQuery(mood, genre, artist, languages = []) {
  const moodKeywords = fetchMoodKeywords(mood);
  const baseMoodTerm = moodKeywords[Math.floor(Math.random() * moodKeywords.length)];

  const parts = [baseMoodTerm];

  if (genre && genre !== "-- Choose Genre --") {
    parts.push(genre);
  }

  if (artist) {
    parts.push(artist);
  }

  // Language-specific search hints
  if (languages && languages.length > 0) {
    // Map language names to search keywords
    const languageKeywords = {
      "Kannada": "Kannada song",
      "Hindi": "Hindi song",
      "English": "English song",
      "Telugu": "Telugu song",
      "Tamil": "Tamil song",
      "Malayalam": "Malayalam song"
    };
    
    // Add first language preference as search hint
    if (languages[0]) {
      const langKeyword = languageKeywords[languages[0]];
      if (langKeyword) parts.push(langKeyword);
    }
  }

  return parts.join(" ");
}

/**
 * Get next page of songs
 */
export const getMoreSongs = async (req, res) => {
  try {
    const { pageToken, mood, genre, artist, languages = [] } = req.query;

    if (!pageToken || !mood) {
      return res.status(400).json({ error: "pageToken and mood required" });
    }

    // Parse languages
    let langArray = [];
    if (typeof languages === "string") {
      langArray = languages.split(",").filter(l => l.trim());
    } else if (Array.isArray(languages)) {
      langArray = languages;
    }

    // For pagination, use first language
    let query = buildSearchQuery(
      mood,
      genre,
      artist,
      langArray.length > 0 ? [langArray[0]] : []
    );
    const data = await fetchYouTubeSongs(query, 20, pageToken);

    const normalizedSongs = data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium.url,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
    }));

    res.json({
      items: normalizedSongs,
      nextPageToken: data.nextPageToken || null,
    });
  } catch (err) {
    console.error("Get more songs error:", err);
    res.status(500).json({ error: "Failed to fetch more songs" });
  }
};
