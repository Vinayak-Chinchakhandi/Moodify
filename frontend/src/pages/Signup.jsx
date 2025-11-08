import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      navigate("/");
    } catch (error) {
      alert("Signup failed! Try again.");
    }
  };

  return (
    <div className="page auth-page">
      <h2>Create an Account</h2>
      <form onSubmit={handleSignup}>
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Signup</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Signup;
