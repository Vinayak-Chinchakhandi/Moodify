import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const ChatMood = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hey there! 👋 How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [detectedMood, setDetectedMood] = useState(null);
  const [showRecommend, setShowRecommend] = useState(false);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === Placeholder Mood Detection ===
  // Later replace this with ML model API call
  const detectMood = async (text) => {
    // Example: you could call your ML model API here
    // const response = await fetch("/api/detect-mood", { method: "POST", body: JSON.stringify({ text }) });
    // const data = await response.json();
    // return data.mood;

    const lower = text.toLowerCase();
    if (lower.includes("happy") || lower.includes("good")) return "Happy";
    if (lower.includes("sad") || lower.includes("down")) return "Sad";
    if (lower.includes("angry") || lower.includes("mad")) return "Angry";
    if (lower.includes("tired") || lower.includes("sleepy")) return "Calm";
    return "Neutral";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Detect mood (replace with ML API later)
    const mood = await detectMood(input);
    setDetectedMood(mood);

    const aiResponse = {
      sender: "ai",
      text: `I sense you're feeling ${
        mood === "Neutral" ? "🤔 Neutral" : `🎭 ${mood}`
      }. Based on this, I can recommend songs that match your vibe! 🎶`,
    };

    setMessages((prev) => [...prev, aiResponse]);
    setShowRecommend(true);
  };

  const handleRecommend = () => {
    if (detectedMood) {
      navigate("/recommendations", {
        state: {
          source: "chat",
          mood: detectedMood,
        },
      });
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* 💬 Chat Box */}
        <div className="w-full max-w-2xl glass-card p-8 flex flex-col justify-between min-h-[520px] backdrop-blur-2xl border border-white/10 rounded-2xl">
          <h2 className="text-3xl font-extrabold mb-4 gradient-text text-center">
            Chat Mood Detection 💬
          </h2>

          {/* 🗨️ Chat Window */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2 scrollbar-thin scrollbar-thumb-cyan-400/50 scrollbar-track-transparent">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm md:text-base ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white"
                      : "bg-white/10 text-gray-200 border border-white/10"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
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
                Yes, recommend songs 🎶
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
      </div>
    </PageWrapper>
  );
};

export default ChatMood;
