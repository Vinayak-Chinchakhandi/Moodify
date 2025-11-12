import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import PlaylistCard from "../components/PlaylistCard";
import AudioPlayer from "../components/AudioPlayer";
import { auth, db } from "../firebase/firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Reference to the current user's favorites
    const userDocRef = doc(db, "users", auth.currentUser.uid);

    // Real-time listener
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFavorites(data.favorites || []); // defaults to empty array if none
      }
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24">
        <div className="relative z-10 w-full max-w-5xl glass-card backdrop-blur-3xl border border-white/10 p-10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)] hover:shadow-[0_0_35px_rgba(0,255,255,0.15)] transition-all duration-500">
          {/* === 🔖 Title Section === */}
          <h2 className="text-4xl font-extrabold mb-4 gradient-text">
            Your Favorites ❤️
          </h2>
          <p className="text-gray-300 text-lg mb-10">
            Save, listen, and relive the songs that you love the most.
            Your personal collection of top vibes 🎶
          </p>

          {/* === 🎵 Favorites Grid === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {favorites.length > 0 ? (
              favorites.map((song, index) => <PlaylistCard key={index} song={song} />)
            ) : (
              <p className="text-gray-400 col-span-full">No favorites yet. Start adding your favorite songs! 🎵</p>
            )}
          </div>

          {/* === 🎧 Audio Player === */}
          {favorites.length > 0 && (
            <div className="flex justify-center mb-10">
              <AudioPlayer playlist={favorites} />
            </div>
          )}

          {/* === 🔙 Back Button === */}
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

export default Favorites;
