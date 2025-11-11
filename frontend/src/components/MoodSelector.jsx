import React, { useState } from "react";
import { Smile, Frown, Heart, Zap, Coffee, Cloud } from "lucide-react";

const moods = [
  { name: "Happy", icon: <Smile size={28} />, color: "from-yellow-400 via-pink-500 to-orange-400" },
  { name: "Sad", icon: <Frown size={28} />, color: "from-blue-400 via-cyan-500 to-indigo-500" },
  { name: "Romantic", icon: <Heart size={28} />, color: "from-pink-400 via-red-500 to-purple-500" },
  { name: "Energetic", icon: <Zap size={28} />, color: "from-orange-400 via-yellow-500 to-pink-500" },
  { name: "Calm", icon: <Cloud size={28} />, color: "from-cyan-400 via-blue-400 to-teal-500" },
  { name: "Focus", icon: <Coffee size={28} />, color: "from-purple-400 via-indigo-500 to-blue-500" },
];

const MoodSelector = ({ onSelect }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood.name);
    if (onSelect) onSelect(mood.name);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-10">
      <h2 className="text-3xl font-bold mb-8 gradient-text text-center">
        Select Your Mood 🎧
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-2xl">
        {moods.map((mood) => (
          <button
            key={mood.name}
            onClick={() => handleMoodSelect(mood)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 backdrop-blur-xl glass-card text-white font-semibold transition-all duration-300 shadow-[0_0_25px_rgba(255,0,255,0.15)]
              hover:scale-105 hover:shadow-[0_0_40px_rgba(0,255,255,0.25)]
              ${selectedMood === mood.name ? "ring-4 ring-cyan-400 shadow-[0_0_45px_rgba(0,255,255,0.4)]" : ""}`}
          >
            <div
              className={`p-4 rounded-full mb-3 bg-gradient-to-r ${mood.color} animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
            >
              {mood.icon}
            </div>
            <span className="text-lg">{mood.name}</span>
          </button>
        ))}
      </div>

      {/* ✨ Gradient Text Styling */}
      <style>{`
        .gradient-text {
          background: linear-gradient(to right, #00ffff, #ff00ff, #ff6600);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default MoodSelector;




//USAGE
// import MoodSelector from "../components/MoodSelector";

// const ManualSelection = () => {
//   const handleMood = (mood) => {
//     console.log("Selected mood:", mood);
//     // Navigate or fetch mood-based recommendations
//   };

//   return (
//     <div className="page-container">
//       <MoodSelector onSelect={handleMood} />
//     </div>
//   );
// };
