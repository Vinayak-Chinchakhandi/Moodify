import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import PlaylistCard from "../components/PlaylistCard";
import AudioPlayer from "../components/AudioPlayer";
import { auth, db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);

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

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24 text-white">
        <div className="relative z-10 w-full max-w-6xl glass-card p-10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)]">
          {/* 🎶 Title Section */}
          <h2 className="text-4xl font-extrabold mb-4 gradient-text">
            Your Playlists 🎶
          </h2>

          <p className="text-gray-300 text-lg mb-10">
            Create, customize, and organize playlists for every mood and moment.
          </p>

          {/* 📂 Playlists Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {playlists.length > 0 ? (
              playlists.map((playlist, index) => (
                <PlaylistCard key={index} song={playlist} />
              ))
            ) : (
              <p className="text-gray-400 col-span-full">
                No playlists yet. Start creating your own! 🎵
              </p>
            )}
          </div>

          {/* 🎧 Audio Player Preview */}
          {playlists.length > 0 && playlists[0].songs && playlists[0].songs.length > 0 && (
            <div className="flex justify-center mb-10">
              <AudioPlayer playlist={playlists[0].songs} />
            </div>
          )}

          {/* 🏠 Back to Home Button */}
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
