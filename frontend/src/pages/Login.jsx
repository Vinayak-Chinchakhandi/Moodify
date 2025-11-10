import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email && password) {
        console.log("✅ Mock login successful:", email);
        navigate("/home");
      } else {
        alert("Please enter valid credentials.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,#0a0a1a,#000)] text-white overflow-hidden transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,0,255,0.3),0_0_65px_rgba(0,255,255,0.3)]">
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-2xl shadow-[0_0_25px_rgba(255,0,255,0.2)] p-8 text-center transition-all hover:shadow-[0_0_35px_rgba(0,255,255,0.3)]">
        <h2 className="text-4xl font-extrabold mb-4 gradient-text">Welcome Back 🎵</h2>
        <p className="text-gray-400 mb-8">Login to continue your Moodify experience.</p>

        <form onSubmit={handleLogin} className="flex flex-col space-y-5">
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="password"
            placeholder="Password"
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-cyan-400 hover:text-pink-400 transition">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;









// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../services/firebase";
// import ParticleBackground from "../components/ParticleBackground";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       navigate("/home");
//     } catch (error) {
//       alert("❌ Login failed! Check your credentials.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,#0a0a1a,#000)] text-white overflow-hidden transition-all duration-500 hover:shadow-[0_0_35px_rgba(255,0,255,0.3),0_0_65px_rgba(0,255,255,0.3)]">
//       <ParticleBackground />

//       <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-2xl shadow-[0_0_25px_rgba(255,0,255,0.2)] p-8 text-center transition-all hover:shadow-[0_0_35px_rgba(0,255,255,0.3)]">
//         <h2 className="text-4xl font-extrabold mb-4 gradient-text">Welcome Back 🎵</h2>
//         <p className="text-gray-400 mb-8">Login to continue your Moodify experience.</p>

//         <form onSubmit={handleLogin} className="flex flex-col space-y-5">
//           <input
//             type="email"
//             placeholder="Email"
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className={`mt-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
//               loading
//                 ? "bg-gray-600 cursor-not-allowed"
//                 : "bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105"
//             }`}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="mt-6 text-gray-400">
//           Don’t have an account?{" "}
//           <Link to="/signup" className="text-cyan-400 hover:text-pink-400 transition">
//             Signup
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;
