import { searchArtist } from "../services/itunes.service.js";
import { asyncHandler } from "../middlewares/async.middleware.js";

export const getArtists = asyncHandler(async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === "") {
    return res.status(400).json({ success: false, message: "Artist name required" });
  }

  const artists = await searchArtist(name);

  res.status(200).json({
    success: true,
    data: artists,
  });
});
