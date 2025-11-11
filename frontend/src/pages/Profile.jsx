import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Vinayak Chinchakhandi",
    email: "vinayak@example.com",
    password: "********",
    language1: "English",
    language2: "Kannada",
    language3: "Hindi",
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setForm(user);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser(form);
    setEditing(false);
    alert("✅ Profile updated successfully!");
  };

  const handleLogout = () => navigate("/login");

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-white px-6 py-10">
        {/* 🧠 Profile Card */}
        <div className="relative z-10 w-full max-w-2xl glass-card text-center p-10 backdrop-blur-2xl border border-white/10 rounded-2xl">
          <h2 className="text-4xl font-extrabold mb-6 gradient-text">
            Your Profile 👤
          </h2>

          {!editing ? (
            <div className="space-y-4 text-lg text-gray-300">
              <p>
                <span className="font-semibold text-cyan-400">Name:</span>{" "}
                {user.name}
              </p>
              <p>
                <span className="font-semibold text-pink-400">Email:</span>{" "}
                {user.email}
              </p>
              <p>
                <span className="font-semibold text-orange-400">
                  Preferred Languages:
                </span>
              </p>
              <ul className="text-gray-400">
                <li>1️⃣ {user.language1}</li>
                <li>2️⃣ {user.language2}</li>
                <li>3️⃣ {user.language3}</li>
              </ul>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleEdit}
                  className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105 transition-transform"
                >
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-pink-600 to-red-500 hover:scale-105 transition-transform"
                >
                  🚪 Logout
                </button>
                <Link
                  to="/home"
                  className="px-6 py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition"
                >
                  ⬅ Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSave}
              className="flex flex-col items-center space-y-5 text-left text-gray-300 w-full"
            >
              {/* === Gradient Input Fields === */}
              {[
                { label: "Your Name", key: "name" },
                { label: "Your Email", key: "email" },
                { label: "Your Password", key: "password" },
              ].map((input) => (
                <div
                  key={input.key}
                  className="w-full rounded-lg p-[2px] bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400"
                >
                  <input
                    type={input.key === "password" ? "password" : "text"}
                    value={form[input.key]}
                    onChange={(e) =>
                      setForm({ ...form, [input.key]: e.target.value })
                    }
                    placeholder={input.label}
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a1a]/90 text-white 
                      placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                      transition duration-200"
                    required
                  />
                </div>
              ))}

              {/* 🎧 Language Preferences */}
              <h3 className="text-xl font-semibold text-cyan-300 mt-4">
                🎧 Language Preferences
              </h3>

              {["language1", "language2", "language3"].map((langKey, i) => (
                <div
                  key={langKey}
                  className="relative w-full rounded-lg p-[2px] bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400"
                >
                  <select
                    value={form[langKey]}
                    onChange={(e) =>
                      setForm({ ...form, [langKey]: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a1a]/90 text-white appearance-none
                      focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
                  >
                    <option className="bg-[#111] text-white">Kannada</option>
                    <option className="bg-[#111] text-white">English</option>
                    <option className="bg-[#111] text-white">Hindi</option>
                    <option className="bg-[#111] text-white">Telugu</option>
                    <option className="bg-[#111] text-white">Tamil</option>
                    <option className="bg-[#111] text-white">Malayalam</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    ▼
                  </span>
                </div>
              ))}

              {/* Save / Cancel Buttons */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105 transition-transform shadow-[0_0_25px_rgba(255,0,255,0.3)]"
                >
                  💾 Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-full font-semibold bg-gray-600 hover:bg-gray-700 transition"
                >
                  ✖ Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ✨ Floating Animation */}
        <style>{`
          @keyframes float {
            0% { transform: translateY(0px) scale(1); opacity: 0.4; }
            50% { transform: translateY(-25px) scale(1.1); opacity: 0.8; }
            100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          }
        `}</style>
      </div>
    </PageWrapper>
  );
};

export default Profile;