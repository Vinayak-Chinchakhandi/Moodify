import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const History = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        {/* === Glass Styled Container === */}
        <div className="relative z-10 w-full max-w-2xl glass-card backdrop-blur-3xl border border-white/10 p-10 rounded-3xl shadow-[0_0_25px_rgba(255,255,255,0.05)] hover:shadow-[0_0_35px_rgba(0,255,255,0.15)] transition-all duration-500">
          
          <h2 className="text-4xl font-extrabold mb-4 gradient-text">
            Listening History 🕒
          </h2>

          <p className="text-gray-300 text-lg mb-10 max-w-lg mx-auto">
            Review your recently played tracks and relive your music journey 🎧  
            Keep track of your favorite vibes and rediscover past moments.
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

export default History;
