import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const Playlists = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 text-white">
        {/* 🎵 Glassmorphic Card */}
        <div className="relative z-10 w-full max-w-2xl glass-card p-10 backdrop-blur-2xl border border-white/10">
          <h2 className="text-4xl font-extrabold mb-4 gradient-text">
            Your Playlists 🎶
          </h2>

          <p className="text-gray-300 text-lg mb-8">
            Create, customize, and organize playlists for every mood and moment.
          </p>

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