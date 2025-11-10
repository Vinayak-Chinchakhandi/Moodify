import { Link } from "react-router-dom";

const History = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,#0a0a1a,#000)] text-white overflow-hidden transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,0,255,0.3),0_0_65px_rgba(0,255,255,0.3)]">
      
      {/* 🌌 Particle Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* 🎧 Glass Card Content */}
      <div className="relative z-10 w-full max-w-2xl glass-card text-center p-10">
        <h2 className="text-4xl font-extrabold mb-4 gradient-text">
          Listening History 🕒
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          Review your recently played tracks and relive your music journey.
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
  );
};

export default History;
