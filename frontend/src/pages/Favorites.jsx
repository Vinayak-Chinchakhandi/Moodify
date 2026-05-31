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
    } catch (err) { }
  };

  return (
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
  "
    >
      <div
        className="
  relative
  z-10
  w-full
  max-w-6xl
  glass-card
  p-5
  sm:p-6
  md:p-8
  lg:p-10
  "
      >
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">          <Link
          to="/home"
          className="px-4 py-2
sm:px-6
sm:py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all"
          title="Back to Home"
        >
          ⬅
        </Link>
        </div>

        <h2 className="text-2xl
sm:text-3xl
md:text-4xl font-extrabold mb-4 gradient-text">Your Favorites ❤️</h2>
        <p className="text-gray-300 text-sm
sm:text-base
md:text-lg mb-10">Save, listen, and relive the songs that you love the most.</p>

        <div className="grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-4
sm:gap-6
lg:gap-8
justify-items-center">
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
            <p className="text-gray-400 col-span-full text-sm sm:text-base px-4">
              No favorites yet. Start adding your favorite songs! 🎵</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
