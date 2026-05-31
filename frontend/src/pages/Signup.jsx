import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  // 🔹 Normal Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        favorites: [],
        playlists: [],
        history: [],
        profilePic: "",
        createdAt: new Date(),
      });

      alert("Account created!");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  // 🔹 Google Signup
  const handleGoogleSignup = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

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

      navigate("/home");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-screen text-white px-4 sm:px-6 py-6">
        <div className="
w-full
max-w-sm
sm:max-w-md
bg-white/5
backdrop-blur-2xl
rounded-2xl
shadow-[0_0_25px_rgba(255,0,255,0.2)]
p-5
sm:p-6
md:p-8
text-center
">
          <h2 className="
text-2xl
sm:text-3xl
md:text-4xl
font-extrabold
mb-3
sm:mb-4
gradient-text
">Create Account ✨</h2>

          <form onSubmit={handleSignup} className="flex flex-col space-y-4 sm:space-y-5">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="
w-full
px-4
py-2.5
sm:py-3
rounded-lg
bg-white/10
border
border-white/20
text-white
placeholder-gray-400
"/>

            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="
w-full
px-4
py-2.5
sm:py-3
rounded-lg
bg-white/10
border
border-white/20
text-white
placeholder-gray-400
" F />

            <button type="submit" disabled={loading} className="
py-2.5
sm:py-3
rounded-lg
font-semibold
bg-gradient-to-r
from-cyan-500
via-pink-500
to-orange-400
">
              {loading ? "Creating..." : "Signup"}
            </button>
          </form>

          <button
            onClick={handleGoogleSignup}
            className="
w-full
px-4
py-2.5
sm:py-3
mt-3
sm:mt-4
rounded-lg
bg-white/20
border
border-white/20
hover:bg-white/30
transition
"          >
            Continue with Google
          </button>

          <p className="mt-4 sm:mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:text-pink-400">Login</Link>
          </p>

        </div>
      </div>
    </PageWrapper>
  );
};

export default Signup;
