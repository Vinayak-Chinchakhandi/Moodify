// src/pages/Playlists.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PlaylistCard from "../components/PlaylistCard";
import { auth, db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { removeFromPlaylist, removePlaylist } from "../services/firestoreService";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const userDocRef = doc(db, "users", auth.currentUser.uid);

    // Real-time listener for user's playlists
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPlaylists(data.playlists || []); // Defaults to empty array
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    if (!selectedPlaylist) return;

    const updatedPlaylist = playlists.find(
      (p) => p.name === selectedPlaylist.name
    );

    if (updatedPlaylist) {
      setSelectedPlaylist(updatedPlaylist);
    }
  }, [playlists, selectedPlaylist]);


  // Play a list at index idx
  const playFromList = (list, idx) => {
    const song = list && list[idx];
    if (!song || !song.videoId) return;
    try {
      window.dispatchEvent(new CustomEvent("moodify-play", { detail: { song, playlist: list, index: idx } }));
    } catch (err) {
      console.error("Failed to play from playlist:", err);
    }
  };

  // If a playlist is selected, show its songs
  if (selectedPlaylist) {
    const songs = selectedPlaylist.songs || [];
    const playlistName = selectedPlaylist.name;
    return (
      <>
        <div
          className="
  flex
  flex-col
  items-center
  min-h-screen
  text-center
  px-4
  sm:px-6
  pt-24
  md:pt-28
  text-white
  "
        >
          <div className="relative z-10 w-full max-w-6xl glass-card backdrop-blur-3xl border border-white/10 p-5 sm:p-6 md:p-8 lg:p-10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)]">
            {/* Title + Back Button - Top Left */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
              <button
                onClick={() => setSelectedPlaylist(null)}
                className="px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all"
                title="Back to Playlists"
              >
                ⬅
              </button>
            </div>

            {/* Delete Button - Top Right */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <button
                onClick={async () => {
                  if (!auth.currentUser) return;
                  try {
                    await removePlaylist(auth.currentUser.uid, playlistName);
                    setSelectedPlaylist(null);
                  } catch (err) {
                    console.error("Failed to delete playlist:", err);
                  }
                }}
                className="px-3 py-2 sm:px-4 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 gradient-text">
              {selectedPlaylist.name} 📋
            </h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-10">
              Songs in your playlist
            </p>

            {/* Songs Grid */}
            <div className="grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-4
sm:gap-6
lg:gap-8
justify-items-center mb-12">
              {songs.length > 0 ? (
                songs.map((song, index) => (
                  <PlaylistCard
                    key={`${song.videoId}-${index}`}
                    song={song}
                    showDelete={true}
                    onPlay={() => playFromList(songs, index)}
                    onDelete={async () => {
                      if (!auth.currentUser) return;
                      try {
                        await removeFromPlaylist(auth.currentUser.uid, playlistName, song.videoId);
                        // Real-time listener will update UI
                      } catch (err) {
                        console.error("Failed to remove song from playlist:", err);
                      }
                    }}
                  />
                ))
              ) : (
                <p className="text-gray-400 col-span-full">
                  No songs in this playlist yet. 🎵
                </p>
              )}
            </div>

          </div>
        </div>
      </>
    );
  }

  // Default view: show list of playlists
  return (
    <>
      <div
        className="
  flex
  flex-col
  items-center
  min-h-screen
  text-center
  px-4
  sm:px-6
  pt-24
  md:pt-28
  text-white
  "
      >
        <div className="relative z-10 w-full max-w-6xl glass-card p-5 sm:p-6 md:p-8 lg:p-10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)]">
          {/* Top-left back button to Home */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
            <Link
              to="/home"
              className="px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all"
              title="Back to Home"
            >
              ⬅
            </Link>
          </div>

          {/* Title Section */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 gradient-text">
            Your Playlists 🎶
          </h2>

          <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-10">
            Create, customize, and organize playlists for every mood and moment.
          </p>

          {/* Playlists Grid */}
          <div className="grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-4
sm:gap-6
lg:gap-8
justify-items-center mb-12">
            {playlists.length > 0 ? (
              playlists.map((playlist, index) => (
                <div
                  key={`${playlist.name}-${index}`}
                  className="
group
relative
w-full
max-w-[320px]
bg-white/5
backdrop-blur-2xl
border
border-white/10
rounded-2xl
overflow-hidden
transition-all
duration-300
hover:scale-105
hover:shadow-[0_0_35px_rgba(255,0,255,0.3)]
cursor-pointer
"                >
                  {/* Playlist Cover - show first song's thumbnail or placeholder */}
                  <div
                    className="relative w-full h-44 sm:h-48 overflow-hidden bg-gradient-to-br from-cyan-500 to-pink-500"
                    onClick={() => setSelectedPlaylist(playlist)}
                  >
                    {playlist.songs && playlist.songs.length > 0 && playlist.songs[0]?.thumbnail ? (
                      <img
                        src={playlist.songs[0].thumbnail}
                        alt={playlist.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-4xl">
                        🎵
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <div className="text-3xl">▶</div>
                    </div>
                  </div>

                  {/* Playlist Info */}
                  <div className="p-4 flex flex-col items-center gap-2">
                    <h3 className="text-base sm:text-lg font-semibold gradient-text text-center">
                      {playlist.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm text-center mt-1">
                      {playlist.songs ? `${playlist.songs.length} songs` : "No songs"}
                    </p>

                    {/* Quick play first song button */}
                    {playlist.songs && playlist.songs.length > 0 && (
                      <div className="w-full mt-3 flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => playFromList(playlist.songs, 0)}
                          className="flex-1 px-3 py-2 rounded bg-cyan-500/30 hover:bg-cyan-500/50 text-cyan-300 text-sm font-semibold transition-all"
                        >
                          Play First
                        </button>
                        <button
                          onClick={() => setSelectedPlaylist(playlist)}
                          className="flex-1 px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all"
                        >
                          Open
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-full text-sm sm:text-base px-4">
                No playlists yet. Start creating your own! 🎵
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Playlists;
