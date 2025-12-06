import axios from "axios";

export const searchArtist = async (name) => {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(name)}&entity=musicArtist`;

  const response = await axios.get(url);

  // Extract only useful data
  const results = response.data.results.map(a => ({
    artistId: a.artistId,
    artistName: a.artistName,
  }));

  return results;
};
