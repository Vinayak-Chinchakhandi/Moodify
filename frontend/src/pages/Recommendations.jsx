// src/pages/Recommendations.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  addToFavorites,
  removeFromFavorites,
  addToPlaylist,
  createPlaylist,
  addToHistory,
  getUserPlaylists,
} from "../services/firestoreService";

const Recommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const { mood, genre, artist, source } = state || {};

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [playlistModal, setPlaylistModal] = useState({ show: false, song: null });
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const initStarted = useRef(false);

  useEffect(() => {
    if (initStarted.current) return; // prevent double-run in StrictMode
    initStarted.current = true;

    const fetchInitialData = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        let localLangs = [];

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          setFavorites(data.favorites || []);
          setPlaylists(data.playlists || []);
          localLangs = [data.language1, data.language2, data.language3].filter(Boolean);
        }

        const navLangs = state?.languages || [];
        const useLangs = Array.isArray(navLangs) && navLangs.length > 0 ? navLangs : localLangs;

        const cacheKey = `recommendations:${mood || 'Neutral'}:${genre || ''}:${artist || ''}:${useLangs.join(',')}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
              setSongs(parsed.items);
              setLoading(false);
              return;
            }
          } catch (e) {
            // ignore cache parse errors
          }
        }

        await fetchSongs("", useLangs);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]);

  const fetchSongs = async (pageToken = "", languagesArg = []) => {
    try {
      const languages = (languagesArg && languagesArg.length > 0)
        ? languagesArg
        : userData
          ? [userData.language1, userData.language2, userData.language3].filter(Boolean)
          : [];

      const params = new URLSearchParams({
        mood: mood || "Neutral",
        ...(genre && { genre }),
        ...(artist && { artist }),
        ...(languages.length > 0 && { languages: languages.join(",") }),
        ...(pageToken && { pageToken }),
      });

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/search/songs?${params}`
      );
      if (!res.ok) throw new Error(`API Error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      if (!data.items || !Array.isArray(data.items)) {
        console.error("Invalid response format:", data);
        return;
      }
      setSongs(data.items);
      try {
        const cacheKey = `recommendations:${mood || 'Neutral'}:${genre || ''}:${artist || ''}:${languages.join(',')}`;
        const cache = { key: cacheKey, timestamp: Date.now(), items: data.items };
        sessionStorage.setItem(cacheKey, JSON.stringify(cache));
      } catch (e) { }
    } catch (err) {
      console.error("Error fetching songs:", err);
      alert("Error fetching songs: " + err.message);
    }
  };

  const handleBack = () => {
    if (source === "manual") navigate("/manual-selection");
    else if (source === "mood") navigate("/mood-detection");
    else if (source === "chat") navigate("/chat-mood");
    else navigate("/home");
  };

  const handleLike = async (song) => {
    if (!auth.currentUser) return;
    try {
      const isFav = favorites.some((fav) => fav.videoId === song.videoId);
      if (isFav) {
        await removeFromFavorites(auth.currentUser.uid, song.videoId);
        setFavorites((prev) => prev.filter((fav) => fav.videoId !== song.videoId));
      } else {
        await addToFavorites(auth.currentUser.uid, song);
        setFavorites((prev) => [...prev, { ...song, addedAt: new Date().toISOString() }]);
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  const handleAddToPlaylist = (song) => {
    setPlaylistModal({ show: true, song });
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      await createPlaylist(auth.currentUser.uid, newPlaylistName);
      const updatedPlaylists = await getUserPlaylists(auth.currentUser.uid);
      setPlaylists(updatedPlaylists);
      setNewPlaylistName("");
      alert(`Playlist "${newPlaylistName}" created!`);
    } catch (err) {
      alert("Error creating playlist: " + err.message);
    }
  };

  const handleSelectPlaylist = async (playlistName) => {
    if (!playlistModal.song) return;
    try {
      await addToPlaylist(auth.currentUser.uid, playlistName, playlistModal.song);
      alert(`"${playlistModal.song.title}" added to "${playlistName}"`);
      setPlaylistModal({ show: false, song: null });
    } catch (err) {
      alert("Error adding to playlist: " + err.message);
    }
  };

  // Play song — dispatch full playlist + index so next/prev work globally
  const handlePlaySong = async (song) => {
    if (!song || !song.videoId || song.videoId.trim() === "") {
      console.warn("Attempted to play invalid song", song);
      return;
    }

    if (auth.currentUser) {
      try {
        await addToHistory(auth.currentUser.uid, song);
      } catch (err) {
        console.error("Error adding to history:", err);
      }
    }

    try {
      const idx = songs.findIndex((s) => s.videoId === song.videoId);
      window.dispatchEvent(new CustomEvent("moodify-play", { detail: { song, playlist: songs, index: idx >= 0 ? idx : 0 } }));
    } catch (err) {
      console.error("Failed to dispatch moodify-play", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <p className="text-2xl">Loading your recommendations... 🎵</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen text-white px-3 py-2">
      <div className="glass-card p-4 rounded-lg border border-white/10 mb-2">
        <h2 className="text-2xl font-extrabold mb-1 gradient-text">Your Recommended Songs 🎵</h2>
        <p className="text-gray-300 text-xs">
          Based on {mood && <span className="text-pink-400">Mood: {mood}</span>}
          {genre && <span className="text-cyan-400 ml-2">Genre: {genre}</span>}
          {artist && <span className="text-orange-400 ml-2">Artist: {artist}</span>}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto mb-20 pr-2">
        {songs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No songs found. Try adjusting your preferences.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {songs.map((song) => (
              <div
                key={song.videoId}
                className="glass-card p-3 rounded-lg border border-white/10 overflow-hidden hover:border-cyan-400/50 transition-all group relative cursor-pointer"
                onClick={() => handlePlaySong(song)}
              >
                <div className="relative">
                  <img src={song.thumbnail} alt={song.title} className="w-full h-28 object-cover rounded-lg mb-2 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-4xl">▶</div>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">{song.title}</h3>
                <p className="text-xs text-gray-400 mb-3 line-clamp-1">{song.artist}</p>

                <div className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); handleLike(song); }} className={`flex-1 px-1.5 py-1 rounded text-xs font-semibold transition-all ${favorites.some((fav) => fav.videoId === song.videoId) ? "bg-pink-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>
                    {favorites.some((fav) => fav.videoId === song.videoId) ? "❤️" : "🤍"}
                  </button>

                  <button onClick={(e) => { e.stopPropagation(); handleAddToPlaylist(song); }} className="flex-1 px-1.5 py-1 rounded text-xs font-semibold bg-white/10 text-gray-300 hover:bg-white/20 transition-all">
                    📋
                  </button>

                  <button onClick={(e) => { e.stopPropagation(); handlePlaySong(song); }} className="flex-1 px-1.5 py-1 rounded text-xs font-semibold bg-cyan-500/30 text-cyan-300 hover:bg-cyan-500/50 transition-all">
                    ▶
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed top-6 right-6 z-40">
        <button onClick={handleBack} className="px-8 py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all">⬅ Back</button>
      </div>

      {playlistModal.show && playlistModal.song && (
        <PlaylistModal
          playlistModal={playlistModal}
          setPlaylistModal={setPlaylistModal}
          playlists={playlists}
          setPlaylists={setPlaylists}
          newPlaylistName={newPlaylistName}
          setNewPlaylistName={setNewPlaylistName}
          handleCreatePlaylist={handleCreatePlaylist}
          handleSelectPlaylist={handleSelectPlaylist}
        />
      )}
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 0 25px rgba(255, 0, 255, 0.15);
        }
        .gradient-text {
          background: linear-gradient(to right, #00ffff, #ff00ff, #ff6600);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

function PlaylistModal({ playlistModal, setPlaylistModal, playlists, setPlaylists, newPlaylistName, setNewPlaylistName, handleCreatePlaylist, handleSelectPlaylist }) {
  const [selected, setSelected] = useState(null);

  if (!playlistModal.show || !playlistModal.song) return null;

  const onConfirm = async () => {
    if (!selected) return;
    await handleSelectPlaylist(selected);
  };

  const createAndSave = async () => {
    const name = newPlaylistName?.trim();
    if (!name) return;
    await handleCreatePlaylist();
    await handleSelectPlaylist(name);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="glass-card p-6 rounded-2xl border border-white/10 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-extrabold text-transparent bg-clip-text gradient-text">Add to Playlist</h3>
          <button onClick={() => setPlaylistModal({ show: false, song: null })} className="text-sm text-gray-300 hover:text-white">Close</button>
        </div>

        {playlists.length > 0 ? (
          <div className="grid gap-2 mb-4 max-h-48 overflow-y-auto">
            {playlists.map((pl) => (
              <button
                key={pl.name}
                onClick={() => setSelected(pl.name)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-all border ${selected === pl.name ? 'border-cyan-400 bg-cyan-600/20 text-white' : 'border-white/10 bg-white/5 text-gray-200 hover:border-cyan-400 hover:bg-white/10'}`}>
                {pl.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-3">No playlists yet — create one below.</p>
        )}

        <div className="border-t border-white/10 pt-4 mb-4">
          <label className="text-sm text-gray-300 mb-2 block">Create new playlist</label>
          <div className="flex gap-2">
            <input type="text" value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} placeholder="Playlist name..." className="flex-1 px-3 py-2 rounded bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm" />
            <button onClick={createAndSave} className="px-4 py-2 rounded bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold">Create & Save</button>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded bg-cyan-500/30 text-cyan-200 font-semibold hover:bg-cyan-500/50">Save</button>
          <button onClick={() => setPlaylistModal({ show: false, song: null })} className="flex-1 px-3 py-2 rounded bg-white/10 text-gray-300 hover:bg-white/20">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Recommendations;