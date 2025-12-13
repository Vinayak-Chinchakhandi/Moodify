import axios from "axios";

// Mock data fallback for when API fails
const FALLBACK_SONGS = {
  Happy: [
    { videoId: "jNQXAC9IVRw", title: "Me at the zoo", thumbnail: "https://i.ytimg.com/vi/jNQXAC9IVRw/default.jpg" },
    { videoId: "dQw4w9WgXcQ", title: "Never Gonna Give You Up", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg" },
  ],
  Sad: [
    { videoId: "e-IWRmpefzE", title: "Someone Like You", thumbnail: "https://i.ytimg.com/vi/e-IWRmpefzE/default.jpg" },
    { videoId: "kffacxfA7g4", title: "Hallelujah", thumbnail: "https://i.ytimg.com/vi/kffacxfA7g4/default.jpg" },
  ],
  Calm: [
    { videoId: "lFEVJwef-gw", title: "Weightless by Marconi Union", thumbnail: "https://i.ytimg.com/vi/lFEVJwef-gw/default.jpg" },
    { videoId: "FrDjidLpsDQ", title: "Meditation Music", thumbnail: "https://i.ytimg.com/vi/FrDjidLpsDQ/default.jpg" },
  ],
  Energetic: [
    { videoId: "Xn6927Lj0t0", title: "Uptown Funk", thumbnail: "https://i.ytimg.com/vi/Xn6927Lj0t0/default.jpg" },
    { videoId: "kJQP7kiw9Fk", title: "Blinding Lights", thumbnail: "https://i.ytimg.com/vi/kJQP7kiw9Fk/default.jpg" },
  ],
};

export async function fetchYouTubeSongs(query, limit = 20, pageToken = "") {
  const YT_API_KEY = process.env.YT_API_KEY;
  
  if (!YT_API_KEY) {
    console.warn("⚠️ YouTube API key is missing - using fallback songs");
    return getFallbackSongs(limit);
  }

  try {
    console.log(`🎵 Fetching YouTube songs for: "${query}"`);
    
    // First search to get video IDs
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${limit * 2}&q=${encodeURIComponent(
      query
    )}&key=${YT_API_KEY}&pageToken=${pageToken}&order=relevance`;

    const searchRes = await axios.get(searchUrl, { timeout: 10000 });
    
    if (!searchRes.data.items || searchRes.data.items.length === 0) {
      console.warn(`⚠️ No results found for query: "${query}" - using fallback`);
      return getFallbackSongs(limit);
    }

    const videoIds = searchRes.data.items.map((item) => item.id.videoId).join(",");

    // Get video durations to filter out shorts (< 60 seconds)
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YT_API_KEY}`;
    const detailsRes = await axios.get(detailsUrl, { timeout: 10000 });

    // Create a map of video ID to duration
    const durationMap = {};
    detailsRes.data.items.forEach((item) => {
      const durationStr = item.contentDetails.duration; // PT format: PT1H2M3S
      const duration = parseISO8601Duration(durationStr);
      durationMap[item.id] = duration;
    });

    // Filter items: keep only videos >= 60 seconds
    const filteredItems = searchRes.data.items.filter((item) => {
      const duration = durationMap[item.id.videoId] || 0;
      return duration >= 60; // 60 seconds minimum to avoid shorts
    });

    // Slice to match requested limit
    const limitedItems = filteredItems.slice(0, limit);

    if (limitedItems.length === 0) {
      console.warn(`⚠️ No valid songs found after filtering - using fallback`);
      return getFallbackSongs(limit);
    }

    console.log(`✅ Found ${limitedItems.length} songs`);

    return {
      items: limitedItems,
      nextPageToken: searchRes.data.nextPageToken || null,
      pageInfo: searchRes.data.pageInfo,
    };
  } catch (error) {
    const status = error.response?.status;
    const message = error.message;
    
    console.error(`❌ YouTube API Error (${status}):`, {
      message,
      query: query.substring(0, 50), // Don't log full query if too long
    });

    // 403 Forbidden usually means quota exceeded or invalid key
    if (status === 403) {
      console.warn("🔴 API Quota Exceeded or Invalid Key - Switching to fallback songs");
    }

    // Return fallback songs instead of crashing
    return getFallbackSongs(limit);
  }
}

/**
 * Get fallback songs when API fails
 */
function getFallbackSongs(limit = 20) {
  const allSongs = Object.values(FALLBACK_SONGS).flat();
  return {
    items: allSongs.slice(0, limit).map((song) => ({
      id: { videoId: song.videoId },
      snippet: {
        title: song.title,
        thumbnails: {
          default: { url: song.thumbnail },
        },
      },
    })),
    nextPageToken: null,
    pageInfo: { totalResults: allSongs.length, resultsPerPage: limit },
    isFallback: true,
  };
}

// Parse ISO 8601 duration format (PT1H2M3S) to seconds
function parseISO8601Duration(durationStr) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = durationStr.match(regex);
  
  if (!matches) return 0;

  const hours = parseInt(matches[1] || 0, 10);
  const minutes = parseInt(matches[2] || 0, 10);
  const seconds = parseInt(matches[3] || 0, 10);

  return hours * 3600 + minutes * 60 + seconds;
}