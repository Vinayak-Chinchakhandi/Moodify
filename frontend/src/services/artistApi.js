import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export const fetchArtists = async (name) => {
  if (!name || name.length < 2) return [];

  try {
    const res = await axios.get(
      `${BASE_URL}/api/artists/search?name=${name}`
    );
    return res.data.data;
  } catch (err) {
    console.error("Artist fetch error:", err);
    return [];
  }
};