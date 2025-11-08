import { Link } from "react-router-dom";

const Home = () => (
  <div className="page">
    <h1>Welcome to Moodify 🎧</h1>
    <p>Discover songs that match your emotions.</p>

    {/* 👇 Temporary test links for all pages */}
    <div style={{ marginTop: "30px" }}>
      <h3>🔧 Development Navigation. Just for testing</h3>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
        <li><Link to="/mood-detection">Mood Detection</Link></li>
        <li><Link to="/chat-mood">Chat Mood</Link></li>
        <li><Link to="/recommendations">Recommendations</Link></li>
        <li><Link to="/favorites">Favorites</Link></li>
        <li><Link to="/playlists">Playlists</Link></li>
        <li><Link to="/history">History</Link></li>
      </ul>
    </div>
  </div>
);

export default Home;
