import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import PlaylistCard from "../components/PlaylistCard";
import AudioPlayer from "../components/AudioPlayer";
import { auth, db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { clearHistory } from "../services/firestoreService";

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

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24 text-white">
        <div className="relative z-10 w-full max-w-6xl glass-card p-10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)]">
          {/* 🎵 Title Section */}
          <h2 className="text-4xl font-extrabold mb-4 gradient-text">
            Recently Played ⏱️
          </h2>
          <p className="text-gray-300 text-lg mb-10">
            Keep track of the songs you’ve recently listened to. Replay your favorite moments!
          </p>

          {/* 🎶 History Grid */}
            <div className="flex items-center justify-between mb-6">
              <div />
              {history.length > 0 && (
                <button
                  onClick={async () => {
                    if (!auth.currentUser) return;
                    try {
                      await clearHistory(auth.currentUser.uid);
                    } catch (err) {
                      console.error("Failed to clear history:", err);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-full shadow-md hover:opacity-90"
                >
                  Clear History
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {history.length > 0 ? (
                history.map((song, index) => (
                  <PlaylistCard key={index} song={song} />
                ))
              ) : (
                <p className="text-gray-400 col-span-full">
                  No recently played songs yet. Start listening to add to your history! 🎵
                </p>
              )}
            </div>

          {/* 🎧 Audio Player */}
          {history.length > 0 && (
            <div className="flex justify-center mb-10">
              <AudioPlayer playlist={history} />
            </div>
          )}

          {/* 🔙 Back Button */}
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

export default History;
