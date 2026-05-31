import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] sm:min-h-[250px] w-full px-4 text-center">
      {/* 🌈 Spinning Gradient Ring */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 animate-pulse">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-l-pink-500 animate-spin" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 blur-md opacity-70 animate-pulse" />
      </div>

      {/* ✨ Loading Text */}
      <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl font-semibold gradient-text animate-pulse text-center">
        {message}
      </p>

      {/* 🎨 Gradient + Glow Style */}
      <style>{`
        .gradient-text {
          background: linear-gradient(to right, #00ffff, #ff00ff, #ff6600);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(255,0,255,0.3), 0 0 30px rgba(0,255,255,0.2); }
          50% { box-shadow: 0 0 25px rgba(255,0,255,0.6), 0 0 50px rgba(0,255,255,0.5); }
        }
      `}</style>
    </div>
  );
};

export default Loader;



//USAGE
// import Loader from "../components/Loader";

// const Recommendations = () => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 2500);
//   }, []);

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       {loading ? <Loader message="Analyzing your mood..." /> : <RecommendationsList />}
//     </div>
//   );
// };
