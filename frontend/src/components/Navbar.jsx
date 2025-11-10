import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png"; // ✅ import your logo

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      {/* === Logo Section === */}
      <div className="nav-logo">
        <Link to="/" className="nav-brand">
          <img src={logo} alt="Moodify Logo" className="nav-logo-img" />
        </Link>
        Moodify
      </div>

      {/* === Navigation Links === */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>

        {/* temporary test links */}
        <li><Link to="/mood-detection">Mood Detection</Link></li>
        <li><Link to="/chat-mood">Chat Mood</Link></li>
        <li><Link to="/recommendations">Recommendations</Link></li>
        <li><Link to="/favorites">Favorites</Link></li>
        <li><Link to="/playlists">Playlists</Link></li>
        <li><Link to="/history">History</Link></li>

        {!user ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        ) : (
          <li><button onClick={logout}>Logout</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
