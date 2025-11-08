import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="nav-logo">🎵 Moodify</div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>

                {/* temporary test links */}
                
                <li><Link to="/mood-detection">Mood Detection</Link></li>
                <li><Link to="/chat-mood">Chat Mood</Link></li>
                <li><Link to="/recommendations">Recommendations</Link></li>
                <li><Link to="/favorites">Favorites</Link></li>
                <li><Link to="/playlists">Playlists</Link></li>
                <li><Link to="/history">History</Link></li>

                {user && (
                    <>
                        <li><Link to="/mood-detection">Mood Detection</Link></li>
                        <li><Link to="/chat-mood">Chat Mood</Link></li>
                        <li><Link to="/recommendations">Recommendations</Link></li>
                        <li><Link to="/favorites">Favorites</Link></li>
                        <li><Link to="/playlists">Playlists</Link></li>
                        <li><Link to="/history">History</Link></li>
                    </>
                )}
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
