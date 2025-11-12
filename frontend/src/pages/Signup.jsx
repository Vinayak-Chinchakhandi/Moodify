import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { auth, db } from "../firebase/firebase"; // firebase.js and firestore.js
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Firebase signup successful:", user.email);

      // 2️⃣ Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        favorites: [],
        playlists: [],
        history: [],
        profilePic: "", // default empty, user can upload later
        createdAt: new Date(),
      });

      alert("✅ Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("❌ Signup error:", error);
      alert(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-white px-6">
        <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-2xl shadow-[0_0_25px_rgba(255,0,255,0.2)] p-8 text-center transition-all hover:shadow-[0_0_35px_rgba(0,255,255,0.3)]">
          <h2 className="text-4xl font-extrabold mb-4 gradient-text">
            Create Account ✨
          </h2>
          <p className="text-gray-400 mb-8">
            Join Moodify and discover your music mood.
          </p>

          <form onSubmit={handleSignup} className="flex flex-col space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105"
              }`}
            >
              {loading ? "Creating Account..." : "Signup"}
            </button>
          </form>

          <p className="mt-6 text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 hover:text-pink-400 transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Signup;
