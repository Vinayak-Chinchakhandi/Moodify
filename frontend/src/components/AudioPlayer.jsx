import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, Heart, ExternalLink, List } from "lucide-react";
import { addToFavorites, removeFromFavorites, addToHistory, addToPlaylist, createPlaylist, getUserPlaylists } from "../services/firestoreService";
import { auth } from "../firebase/firebase";

const isValidVideoId = (id) => typeof id === "string" && id.trim().length >= 3;

const AudioPlayer = ({ playlist = [], isGlobal = false }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [playlistModal, setPlaylistModal] = useState({ show: false, song: null });
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    try {
      const savedSong = JSON.parse(sessionStorage.getItem("moodifyCurrentSong"));
      const savedIndex = Number(sessionStorage.getItem("moodifyCurrentIndex")) || 0;
      const savedPlaying = sessionStorage.getItem("moodifyIsPlaying") === "true";
      if (savedSong && playlist.length > 0) {
        const index = playlist.findIndex((s) => s.videoId === savedSong.videoId);
        if (index !== -1) {
          setCurrentIndex(index);
          setIsPlaying(savedPlaying);
        } else {
          setCurrentIndex(Math.min(savedIndex, playlist.length - 1));
          setIsPlaying(savedPlaying);
        }
      } else if (playlist.length > 0) {
        // default to first on new playlist
        setCurrentIndex(0);
      }
    } catch (err) { console.error("Failed to restore session:", err); }
  }, [playlist]);

  const currentSong = playlist.length > 0 ? playlist[currentIndex] : { title: "No song", artist: "", videoId: null, thumbnail: null };

  useEffect(() => {
    setIsLiked(!!currentSong?.isLiked);
  }, [currentIndex, currentSong]);

  // update UI when video actually loads (emitted by BackgroundVideoPlayer)
  useEffect(() => {
    const handleVideoLoaded = (e) => {
      const vid = e.detail?.videoId;
      if (!vid || playlist.length === 0) return;
      const idx = playlist.findIndex((s) => s.videoId === vid);
      if (idx !== -1) setCurrentIndex(idx);
    };
    window.addEventListener("moodify-video-loaded", handleVideoLoaded);
    return () => window.removeEventListener("moodify-video-loaded", handleVideoLoaded);
  }, [playlist]);

  // update isPlaying when background player broadcasts state
  useEffect(() => {
    const handlePlayStateChange = (e) => setIsPlaying(e.detail?.isPlaying || false);
    window.addEventListener("moodify-video-state", handlePlayStateChange);
    return () => window.removeEventListener("moodify-video-state", handlePlayStateChange);
  }, []);

  const handleNext = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    const nextSong = playlist[nextIndex];
    // dispatch global play with playlist and index
    window.dispatchEvent(new CustomEvent("moodify-play", { detail: { song: nextSong, playlist, index: nextIndex } }));
    setCurrentIndex(nextIndex);
    setIsPlaying(true);
    try { sessionStorage.setItem("moodifyCurrentIndex", String(nextIndex)); sessionStorage.setItem("moodifyCurrentSong", JSON.stringify(nextSong)); sessionStorage.setItem("moodifyIsPlaying","true"); } catch {}
  }, [playlist, currentIndex]);

  const handlePrev = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    const prevSong = playlist[prevIndex];
    window.dispatchEvent(new CustomEvent("moodify-play", { detail: { song: prevSong, playlist, index: prevIndex } }));
    setCurrentIndex(prevIndex);
    setIsPlaying(true);
    try { sessionStorage.setItem("moodifyCurrentIndex", String(prevIndex)); sessionStorage.setItem("moodifyCurrentSong", JSON.stringify(prevSong)); sessionStorage.setItem("moodifyIsPlaying","true"); } catch {}
  }, [playlist, currentIndex]);

  const handlePlayPause = () => {
    if (!currentSong || !isValidVideoId(currentSong.videoId)) return;
    const newState = !isPlaying;
    setIsPlaying(newState);
    try { sessionStorage.setItem("moodifyIsPlaying", newState ? "true" : "false"); } catch {}
    window.dispatchEvent(new CustomEvent("moodify-control-play-pause", { detail: { isPlaying: newState } }));
  };

  // STREAM behavior:
  // - persist current song + playlist + index
  // - inform background player to pause (moodify-enter-visual-stream)
  // - navigate to /stream with state so iframe has immediate data
  const handleStream = () => {
    if (!currentSong || !isValidVideoId(currentSong.videoId)) return;
    try {
      const payload = { song: currentSong, playlist: playlist.length ? playlist : [currentSong], index: currentIndex };
      sessionStorage.setItem("moodifyCurrentSong", JSON.stringify(payload.song));
      sessionStorage.setItem("moodifyCurrentPlaylist", JSON.stringify(payload.playlist));
      sessionStorage.setItem("moodifyCurrentIndex", String(payload.index || 0));
      // notify background player to pause and persist current time
      window.dispatchEvent(new CustomEvent("moodify-enter-visual-stream", { detail: { song: payload.song, playlist: payload.playlist, index: payload.index } }));
    } catch (err) { console.error("handleStream session error:", err); }
    // give a slight delay so background player can persist time before we navigate
    setTimeout(() => navigate("/stream", { state: { song: currentSong, playlist, index: currentIndex } }), 120);
  };

  const handleLike = async () => {
    if (!currentSong || !isValidVideoId(currentSong.videoId)) return;
    if (!auth.currentUser) return;
    try {
      if (!isLiked) { await addToFavorites(auth.currentUser.uid, currentSong); setIsLiked(true); }
      else { await removeFromFavorites(auth.currentUser.uid, currentSong.videoId); setIsLiked(false); }
    } catch (err) { console.error("Like action failed:", err); }
  };

  const handleAddToPlaylist = (song) => {
    setPlaylistModal({ show: true, song });
    // load playlists
    (async () => {
      try {
        if (!auth.currentUser) return;
        const pls = await getUserPlaylists(auth.currentUser.uid);
        setPlaylists(pls || []);
      } catch (err) {
        console.error("Failed to load playlists:", err);
      }
    })();
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    if (!auth.currentUser) return;
    try {
      await createPlaylist(auth.currentUser.uid, newPlaylistName);
      const updated = await getUserPlaylists(auth.currentUser.uid);
      setPlaylists(updated || []);
      setNewPlaylistName("");
      alert(`Playlist "${newPlaylistName}" created!`);
    } catch (err) {
      alert("Error creating playlist: " + err.message);
    }
  };

  const handleSelectPlaylist = async (playlistName) => {
    if (!playlistModal.song) return;
    if (!auth.currentUser) return;
    try {
      await addToPlaylist(auth.currentUser.uid, playlistName, playlistModal.song);
      alert(`"${playlistModal.song.title}" added to "${playlistName}"`);
      setPlaylistModal({ show: false, song: null });
    } catch (err) {
      alert("Error adding to playlist: " + err.message);
    }
  };

  if (!isGlobal && playlist.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50">
        <div className="bg-gradient-to-r from-cyan-900/80 via-purple-900/80 to-orange-900/80 backdrop-blur-lg border border-white/20 rounded-xl p-4 shadow-2xl shadow-purple-900/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-14 h-14 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                {currentSong?.thumbnail ? (
                  <img src={currentSong.thumbnail} alt={currentSong.title || "cover"} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-sm text-gray-300">No cover</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-white font-bold truncate text-sm md:text-base">{currentSong?.title || "No song"}</h4>
                <p className="text-cyan-200 text-xs md:text-sm truncate">{currentSong?.artist || ""}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={handlePrev} className="p-2 rounded-lg hover:bg-white/20 transition-colors text-cyan-300 hover:text-white" title="Previous"><SkipBack size={18} /></button>
              <button onClick={handlePlayPause} className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white transition-all shadow-lg" title={isPlaying ? "Pause" : "Play"}>{isPlaying ? <Pause size={18} /> : <Play size={18} />}</button>
              <button onClick={handleNext} className="p-2 rounded-lg hover:bg-white/20 transition-colors text-cyan-300 hover:text-white" title="Next"><SkipForward size={18} /></button>
              <button onClick={handleStream} className="p-2 rounded-lg hover:bg-white/20 transition-colors text-orange-300 hover:text-orange-100 flex items-center gap-1" title="Play on Stream"><ExternalLink size={18} /></button>
              <button onClick={() => handleAddToPlaylist(currentSong)} className="p-2 rounded-lg hover:bg-white/20 transition-colors text-gray-300 hover:text-white" title="Add to playlist"><List size={18} /></button>
              <button onClick={handleLike} className={`p-2 rounded-lg transition-all ${isLiked ? "bg-pink-600/80 text-white shadow-lg" : "hover:bg-white/20 text-gray-300 hover:text-pink-400"}`} title={isLiked ? "Unlike" : "Like"}><Heart size={18} fill={isLiked ? "currentColor" : "none"} /></button>
            </div>
          </div>
        </div>
      </div>

      {playlistModal.show && (
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
    </>
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
    // create playlist then add
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
          <button onClick={() => setPlaylistModal({ show: false, song: null })} className="flex-1 px-4 py-2 rounded bg-white/10 text-gray-300 hover:bg-white/20">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;