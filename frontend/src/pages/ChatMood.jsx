import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const ChatMood = () => {
  const navigate = useNavigate();

  // Questions with custom text options (4 options each, values 1-4)
  const questions = [
    {
      q: "How happy are you right now?",
      options: [
        "Not happy at all",
        "A little happy",
        "Quite happy",
        "Very happy",
      ],
    },
    {
      q: "How energetic do you feel?",
      options: ["Exhausted", "Calm", "Alert", "Energized"],
    },
    {
      q: "How relaxed are you?",
      options: [
        "Very tense",
        "Somewhat tense",
        "Somewhat relaxed",
        "Completely relaxed",
      ],
    },
    {
      q: "How motivated are you today?",
      options: ["Not motivated", "A bit motivated", "Motivated", "Extremely motivated"],
    },
    {
      q: "How social or outgoing do you feel?",
      options: ["Withdrawn", "Quiet", "Open", "Outgoing"],
    },
    {
      q: "How much are you enjoying your day?",
      options: ["Not enjoying", "It's okay", "Pretty good", "Loving it"],
    },
  ];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [detectedMood, setDetectedMood] = useState(null);
  const [completed, setCompleted] = useState(false);

  const total = questions.length;

  const onSelect = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    if (index < total - 1) {
      setTimeout(() => setCurrent(index + 1), 150); // small delay for UX
    } else {
      setCompleted(true);
    }
  };

  const detect = () => {
    const sum = answers.reduce((acc, v) => acc + (v || 0), 0);
    const avg = sum / answers.length;

    // Simple mapping from average to mood
    let mood = "Neutral";
    if (avg >= 3.2) mood = "Energetic";
    else if (avg >= 2.6) mood = "Happy";
    else if (avg >= 1.9) mood = "Calm";
    else if (avg >= 1.2) mood = "Sad";

    setDetectedMood(mood);
  };

  const retake = () => {
    setAnswers(Array(questions.length).fill(null));
    setCurrent(0);
    setDetectedMood(null);
    setCompleted(false);
  };

  const goToRecommendations = () => {
    const moodToSend = detectedMood || "Neutral";
    (async () => {
      let langs = [];
      try {
        if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            langs = [data.language1, data.language2, data.language3].filter(Boolean);
          }
        }
      } catch (e) {
        console.error("Error fetching user languages:", e);
      }

      navigate("/recommendations", { state: { source: "chat", mood: moodToSend, languages: langs } });
    })();
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-2xl glass-card p-8 flex flex-col justify-between min-h-[420px] backdrop-blur-2xl border border-white/10 rounded-2xl">
          <h2 className="text-3xl font-extrabold mb-4 gradient-text text-center">Mood Check — Quick Quiz 📝</h2>

          {!detectedMood ? (
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-6">
                <p className="text-gray-300 text-sm text-center">Question {current + 1} of {total}</p>
                <p className="text-lg md:text-xl text-gray-100 font-semibold text-center mt-2">{questions[current].q}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[current].options.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => onSelect(current, i + 1)}
                    className={`px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all border border-white/10
                      bg-white/10 text-gray-200 hover:bg-white/20 focus:outline-none`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-6 text-center">
                {completed ? (
                  <button onClick={detect} className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105 transition-transform">
                    Detect Mood
                  </button>
                ) : (
                  <p className="text-gray-400">Select an option to continue...</p>
                )}
              </div>

              <div className="mt-8 flex justify-center">
                <Link
                  to="/home"
                  className="px-8 py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all"
                >
                  ⬅ Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
              <p className="text-cyan-300 text-lg">Detected Mood</p>
              <h3 className="text-4xl font-extrabold gradient-text">{detectedMood}</h3>

              <div className="flex gap-4">
                <button onClick={retake} className="px-6 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20">Retake Test</button>
                <button onClick={goToRecommendations} className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 text-white">Find Songs</button>
              </div>

              <Link to="/home" className="px-8 py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all">⬅ Back to Home</Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default ChatMood;