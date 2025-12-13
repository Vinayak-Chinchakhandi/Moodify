// src/pages/Favorites.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PlaylistCard from "../components/PlaylistCard";
import { auth, db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { removeFromFavorites } from "../services/firestoreService";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFavorites(data.favorites || []);
      }
    });
    return () => unsubscribe();
  }, []);

  const playFromList = (list, idx) => {
    const song = list[idx];
    if (!song || !song.videoId) return;
    try {
      window.dispatchEvent(new CustomEvent("moodify-play", { detail: { song, playlist: list, index: idx } }));
    } catch (err) {}
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24 pb-32">
        <div className="relative z-10 w-full max-w-5xl glass-card ...">
          <div className="absolute top-6 left-6">
            <Link
              to="/home"
              className="px-8 py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all"
              title="Back to Home"
            >
              ⬅
            </Link>
          </div>

          <h2 className="text-4xl font-extrabold mb-4 gradient-text">Your Favorites ❤️</h2>
          <p className="text-gray-300 text-lg mb-10">Save, listen, and relive the songs that you love the most.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.length > 0 ? (
              favorites.map((song, index) => (
                <PlaylistCard
                  key={index}
                  song={song}
                  showDelete={true}
                  onPlay={() => playFromList(favorites, index)}
                  onDelete={async () => {
                    if (!auth.currentUser) return;
                    try {
                      await removeFromFavorites(auth.currentUser.uid, song.videoId);
                    } catch (err) {
                      console.error("Failed to remove favorite:", err);
                    }
                  }}
                />
              ))
            ) : (
              <p className="text-gray-400 col-span-full">No favorites yet. Start adding your favorite songs! 🎵</p>
            )}
          </div>
        </div>
      </div>
  );
};

export default Favorites;
