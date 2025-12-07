import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import PlaylistCard from "../components/PlaylistCard";
import AudioPlayer from "../components/AudioPlayer";
import { auth, db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

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

  // If a playlist is selected, show its songs
  if (selectedPlaylist) {
    const songs = selectedPlaylist.songs || [];
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24 text-white">
          <div className="relative z-10 w-full max-w-5xl glass-card backdrop-blur-3xl border border-white/10 p-10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)]">
            {/* Title */}
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">
              {selectedPlaylist.name} 📋
            </h2>
            <p className="text-gray-300 text-lg mb-10">
              Songs in your playlist
            </p>

            {/* Songs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {songs.length > 0 ? (
                songs.map((song, index) => <PlaylistCard key={index} song={song} />)
              ) : (
                <p className="text-gray-400 col-span-full">
                  No songs in this playlist yet. 🎵
                </p>
              )}
            </div>

            {/* 🎧 Audio Player */}
            {songs.length > 0 && (
              <div className="flex justify-center mb-10">
                <AudioPlayer playlist={songs} />
              </div>
            )}

            {/* Back to Playlists List Button */}
            <button
              onClick={() => setSelectedPlaylist(null)}
              className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform mr-3"
            >
              ⬅ Back to Playlists
            </button>

            {/* Back to Home Button */}
            <Link
              to="/home"
              className="inline-block px-8 py-3 bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 font-semibold rounded-full shadow-md hover:scale-105 transition-transform"
            >
              🏠 Back to Home
            </Link>
          </div>
        </div>
      </PageWrapper>
    );
  }

  // Default view: show list of playlists
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24 text-white">
        <div className="relative z-10 w-full max-w-6xl glass-card p-10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)]">
          {/* Title Section */}
          <h2 className="text-4xl font-extrabold mb-4 gradient-text">
            Your Playlists 🎶
          </h2>

          <p className="text-gray-300 text-lg mb-10">
            Create, customize, and organize playlists for every mood and moment.
          </p>

          {/* Playlists Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {playlists.length > 0 ? (
              playlists.map((playlist, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedPlaylist(playlist)}
                  className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_35px_rgba(255,0,255,0.3)] cursor-pointer"
                >
                  {/* Playlist Cover - show first song's thumbnail or placeholder */}
                  <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-cyan-500 to-pink-500">
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
                  <div className="p-4">
                    <h3 className="text-lg font-semibold gradient-text text-center">
                      {playlist.name}
                    </h3>
                    <p className="text-gray-400 text-sm text-center mt-1">
                      {playlist.songs ? `${playlist.songs.length} songs` : "No songs"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 col-span-full">
                No playlists yet. Start creating your own! 🎵
              </p>
            )}
          </div>

          {/* Back to Home Button */}
          <Link
            to="/home"
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform"
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Playlists;
