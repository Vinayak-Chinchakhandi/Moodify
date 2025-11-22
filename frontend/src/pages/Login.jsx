import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { auth, db } from "../firebase/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  // 🔹 Normal Email Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("moodifyLoggedIn", "true");
      navigate("/home");
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  // 🔹 Google Login
  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      // Create Firestore doc if first time login
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          favorites: [],
          playlists: [],
          history: [],
          profilePic: user.photoURL || "",
          createdAt: new Date(),
        });
      }

      localStorage.setItem("moodifyLoggedIn", "true");
      navigate("/home");

    } catch (error) {
      alert(error.message);
    }
  };

  // 🔹 Forgot Password
  const handleForgotPassword = async () => {
    if (!email) return alert("Enter your registered email first!");

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <PageWrapper>
      <div className="relative flex flex-col items-center justify-center min-h-screen text-white px-6">
        <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-2xl shadow-[0_0_25px_rgba(255,0,255,0.2)] p-8 text-center">

          <h2 className="text-4xl font-extrabold mb-4 gradient-text">Welcome Back 🎵</h2>

          <form onSubmit={handleLogin} className="flex flex-col space-y-5">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white" />

            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white" />

            <button type="button" onClick={handleForgotPassword} className="text-cyan-400 hover:text-pink-400 text-sm">
              Forgot Password?
            </button>

            <button type="submit" disabled={loading} className="mt-4 py-3 rounded-lg font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="px-4 py-3 w-full mt-4 rounded-lg bg-white/20 border border-white/20 hover:bg-white/30 transition"
          >
            Continue with Google
          </button>

          <p className="mt-6 text-gray-400">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-cyan-400 hover:text-pink-400">Signup</Link>
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
