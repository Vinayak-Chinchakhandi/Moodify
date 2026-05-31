// src/pages/History.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PlaylistCard from "../components/PlaylistCard";
import { auth, db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { clearHistory, removeFromHistory } from "../services/firestoreService";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const userDocRef = doc(db, "users", auth.currentUser.uid);

    // Real-time listener for recently played songs
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHistory(data.history || []); // Defaults to empty array
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Plays the given list starting at index idx
  const playFromList = (list, idx) => {
    const song = list[idx];
    if (!song || !song.videoId) return;
    try {
      window.dispatchEvent(new CustomEvent("moodify-play", { detail: { song, playlist: list, index: idx } }));
    } catch (err) {
      console.error("Failed to play from history list:", err);
    }
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
  text-white
  "
    >
      <div className="relative z-10 w-full max-w-6xl glass-card p-5 sm:p-6 md:p-8 lg:p-10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)]">
        {/* 🎵 Title Section */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 gradient-text">
          Recently Played ⏱️
        </h2>
        <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-10">
          Keep track of the songs you've recently listened to. Replay your favorite moments!
        </p>

        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
          <Link
            to="/home"
            className="px-4 py-2 sm:px-6 sm:py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all"
            title="Back to Home"
          >
            ⬅
          </Link>
        </div>

        {history.length > 0 && (
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <button
              onClick={async () => {
                if (!auth.currentUser) return;
                try {
                  await clearHistory(auth.currentUser.uid);
                } catch (err) {
                  console.error("Failed to clear history:", err);
                }
              }}
              className="px-3 py-2 sm:px-4 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors text-sm"
            >
              Clear
            </button>
          </div>
        )}

        <div className="grid
grid-cols-1
sm:grid-cols-2
lg:grid-cols-3
gap-4
sm:gap-6
lg:gap-8
justify-items-center
mt-6">
          {history.length > 0 ? (
            history.map((song, index) => (
              <PlaylistCard
                key={`${song.videoId}-${index}`}
                song={song}
                showDelete={true}
                onPlay={() => playFromList(history, index)}
                onDelete={async () => {
                  if (!auth.currentUser) return;
                  try {
                    await removeFromHistory(auth.currentUser.uid, song.videoId);
                  } catch (err) {
                    console.error("Failed to remove history item:", err);
                  }
                }}
              />
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-sm sm:text-base px-4">
              No recently played songs yet. Start listening to add to your history! 🎵
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default History;