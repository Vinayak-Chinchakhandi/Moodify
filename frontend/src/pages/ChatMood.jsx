import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ChatMood = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hey there! 👋 How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [detectedMood, setDetectedMood] = useState(null);
  const [showRecommend, setShowRecommend] = useState(false);
  const navigate = useNavigate();

  // 🧠 Mood detection logic
  const detectMood = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("happy") || lower.includes("good")) return "Happy";
    if (lower.includes("sad") || lower.includes("down")) return "Sad";
    if (lower.includes("angry") || lower.includes("mad")) return "Angry";
    if (lower.includes("tired") || lower.includes("sleepy")) return "Calm";
    return "Neutral";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const mood = detectMood(input);
      setDetectedMood(mood);

      const aiResponse = {
        sender: "ai",
        text: `I sense you're feeling ${mood === "Neutral" ? "🤔 Neutral" : `🎭 ${mood}`
          }. Would you like to explore songs that match your vibe? 🎶`,
      };

      setMessages((prev) => [...prev, aiResponse]);
      setShowRecommend(true);
    }, 1000);

    setInput("");
  };

  const handleRecommend = () => {
    if (detectedMood) {
      navigate("/recommendations", {
        state: {
          source: "chat",  // ✅ Added source
          mood: detectedMood
        }
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,#0a0a1a,#000)] text-white overflow-hidden px-4 py-6 transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,0,255,0.3),0_0_65px_rgba(0,255,255,0.3)]">

      {/* 🌌 Particle Background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background:
                "radial-gradient(circle, rgba(0,255,255,0.9) 0%, rgba(255,0,204,0.9) 80%)",
              animation: `float ${5 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      {/* 💬 Chat Box */}
      <div className="relative z-10 w-full max-w-2xl glass-card p-8 flex flex-col justify-between min-h-[520px] backdrop-blur-2xl border border-white/10">
        <h2 className="text-3xl font-extrabold mb-4 gradient-text text-center">
          Chat Mood Detection 💬
        </h2>

        {/* 🗨️ Chat Window */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 scrollbar-thin scrollbar-thumb-cyan-400/50 scrollbar-track-transparent">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm md:text-base ${msg.sender === "user"
                  ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white"
                  : "bg-white/10 text-gray-200 border border-white/10"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* ✏️ Input Box */}
        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 mt-2 border-t border-white/10 pt-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your thoughts..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105 transition-transform"
          >
            Send
          </button>
        </form>

        {/* 🌈 Recommend Button (after mood detection) */}
        {showRecommend && (
          <div className="flex justify-center mt-6 animate-fadeIn">
            <button
              onClick={handleRecommend}
              className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 text-white hover:scale-105 transition-transform shadow-[0_0_25px_rgba(255,0,255,0.3),0_0_45px_rgba(0,255,255,0.3)]"
            >
              Yes, take me there 🎶
            </button>
          </div>
        )}

        {/* 🔙 Back Button */}
        <div className="flex justify-center mt-8 animate-fadeIn">
          <Link
            to="/home"
            className="px-8 py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all"
          >
            ⬅ Back to Home
          </Link>
        </div>
      </div>

      {/* ✨ Floating Animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-25px) scale(1.1); opacity: 0.8; }
          100% { transform: translateY(0px) scale(1); opacity: 0.4; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ChatMood;
