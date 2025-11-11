import { useState } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend, loading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    onSend(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 border-t border-white/10 pt-3 mt-3 w-full"
    >
      <input
        type="text"
        placeholder="Type your thoughts... (Press Enter ↵)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loading}
        className={`flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 text-white transition-all duration-300 ${
          loading
            ? "bg-gray-500 cursor-not-allowed opacity-70"
            : "bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105 shadow-[0_0_20px_rgba(255,0,255,0.3),0_0_40px_rgba(0,255,255,0.3)]"
        }`}
      >
        {loading ? "..." : <Send size={22} />}
      </button>
    </form>
  );
};

export default ChatInput;
