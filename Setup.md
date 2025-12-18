```bash
COMPLETE STRUCTURE 


MOODIFY/
│
├── backend/
│   ├── node_modules/
│   ├── server.js
│   ├── .env
│   │
│   ├── routes/
│   │   ├── artists.routes.js
│   │   ├── mood.routes.js
│   │   ├── search.routes.js
│   │   └── youtube.routes.js
│   │
│   ├── controllers/
│   │   ├── artists.controller.js
│   │   ├── mood.controller.js
│   │   ├── search.controller.js
│   │   └── youtube.controller.js
│   │
│   │── services/
│   │   ├── itunes.service.js
│   │   ├── huggingface.service.js
│   │   └── youtube.service.js
│   │
│   │── middlewares/
│   │   ├── error.middleware.js
│   │   └── async.middleware.js
│   │
│   │── utils/
│   │   └── moodKeywords.js
│   │
│   ├──package.json
│   ├──test-env.js
│   └──package.lock.json
│   
├── frontend/
│   ├── node_modules/
│   │
│   ├── public/
│   │   ├── logo.png
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── logo.png
│   │   │   └── intro.mp4
│   │   │
│   │   ├── components/
│   │   │   ├── Dropdown.jsx
│   │   │   ├── PageWrapper.jsx
│   │   │   ├── SongCard.jsx
│   │   │   ├── ParticleBackground.jsx
│   │   │   ├── backgroundVideoPlayer.jsx
│   │   │   ├── WebcamCapture.jsx
│   │   │   ├── AudioPlayer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PlaylistCard.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   │
│   │   ├── firebase/
│   │   │   ├── auth.js
│   │   │   ├── firebase.js
│   │   │   └── storage.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Intro.jsx
│   │   │   ├── Stream.jsx
│   │   │   ├── ManualSelection.jsx
│   │   │   ├── profile.jsx
│   │   │   ├── MoodDetection.jsx
│   │   │   ├── ChatMood.jsx
│   │   │   ├── Recommendations.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Playlists.jsx
│   │   │   └── History.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── firestoreService.js
│   │   │   └── moodServer.js
│   │   │
│   │   ├── utils/
│   │   │   └── hfEmotionDetector.js
│   │   │
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   │
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   └── tailwind.config.js
│
├── node_modules/               
├── .env                        
├── .gitignore
├── package-lock.json
├── package.json
└── README.md

```

# root .env
NODE_ENV=development

# rontend/ .env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_ENV=development
REACT_APP_FIREBASE_API_KEY='Your Firebase API Key'
REACT_APP_FIREBASE_AUTH_DOMAIN='Your Firebase Auth Domain'
REACT_APP_FIREBASE_PROJECT_ID='Your Firebase Project ID'
REACT_APP_FIREBASE_STORAGE_BUCKET='Your Firebase Storage Bucket'
REACT_APP_FIREBASE_MESSAGING_SENDER_ID='Your Firebase Sender Message ID'
REACT_APP_FIREBASE_APP_ID='Your Firebase App ID'

# backend/ .env
PORT=5000
HF_API_KEY='Your Hugging Face API'
YT_API_KEY='Your YouTube API'

# Install dependencies of both folder at once
npm run install-all

# Now you can start both servers at once:
npm run dev
frontend at http://localhost:3000
backend at http://localhost:5000

---

Full `PageWrapper.jsx` (paste into `frontend/src/components/PageWrapper.jsx` to enable new backgrounds)

```
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AudioPlayer from "./AudioPlayer";
import BackgroundVideoPlayer from "./BackgroundVideoPlayer";
import { auth, db } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Inline renderBackground helper (same as above)
function renderBackground(pathname = '/', introStarted = false) {
	const path = (pathname || '').toLowerCase();

	const dots = (
		<div className="absolute inset-0 overflow-hidden -z-10">
			{[...Array(25)].map((_, i) => (
				<div
					key={i}
					className="absolute w-2 h-2 rounded-full opacity-40 animate-float"
					style={{
						top: `${Math.random() * 100}%`,
						left: `${Math.random() * 100}%`,
						background: 'radial-gradient(circle, #00ffff 0%, #ff00cc 80%)',
						animationDelay: `${Math.random() * 4}s`,
					}}
				/>
			))}
		</div>
	);

	const video = (
		<video
			autoPlay
			loop
			muted
			playsInline
			className="fixed inset-0 w-full h-full object-cover -z-10 pointer-events-none"
			aria-hidden="true"
		>
			<source src={introVideo} type="video/mp4" />
		</video>
	);

	if (path === '/intro') return null;

	const dotsPages = ['/login', '/signup'];
	if (dotsPages.includes(path)) return dots;
	return video;
}

const PageWrapper = ({ children }) => {
	const location = useLocation();

	const [globalPlaylist, setGlobalPlaylist] = useState([]);
	const [playerKey, setPlayerKey] = useState(Date.now());
	const [isPlaying, setIsPlaying] = useState(false);
	const [recentlySongs, setRecentlySongs] = useState([]);

	// Load user history for default playlist (unchanged)
	useEffect(() => {
		if (!auth.currentUser) return;
		const userDocRef = doc(db, "users", auth.currentUser.uid);
		const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
			if (docSnap.exists()) {
				const data = docSnap.data();
				const history = data.history || [];
				setRecentlySongs(history);
				if (globalPlaylist.length === 0 && history.length > 0) {
					setGlobalPlaylist(history.slice(0, 5));
				}
			}
		});
		return () => unsubscribe();
	}, [globalPlaylist.length]);

	// Restore from sessionStorage on mount
	useEffect(() => {
		try {
			const savedPlaylist = JSON.parse(sessionStorage.getItem("moodifyCurrentPlaylist"));
			const savedSong = JSON.parse(sessionStorage.getItem("moodifyCurrentSong"));
			const savedIndex = Number(sessionStorage.getItem("moodifyCurrentIndex")) || 0;
			const savedPlaying = sessionStorage.getItem("moodifyIsPlaying") === "true";
			if (Array.isArray(savedPlaylist) && savedPlaylist.length > 0) {
				setGlobalPlaylist(savedPlaylist);
				setPlayerKey(Date.now());
				setIsPlaying(savedPlaying);
				try { window.dispatchEvent(new CustomEvent("moodify-start", { detail: { videoId: savedSong?.videoId } })); } catch {}
			} else if (savedSong && savedSong.videoId) {
				setGlobalPlaylist([savedSong]);
				setPlayerKey(Date.now());
				setIsPlaying(savedPlaying);
				try { window.dispatchEvent(new CustomEvent("moodify-start", { detail: { videoId: savedSong.videoId } })); } catch {}
			}
		} catch (err) {}
	}, []);

	// Handle moodify-play events: accept { song, playlist, index }
	useEffect(() => {
		const handler = (e) => {
			const song = e.detail?.song;
			const playlist = e.detail?.playlist;
			const index = typeof e.detail?.index === "number" ? e.detail.index : 0;
			if (!song || !song.videoId) {
				console.warn("moodify-play ignored: invalid song", e.detail);
				return;
			}
			if (Array.isArray(playlist) && playlist.length > 0) {
				setGlobalPlaylist(playlist);
			} else {
				setGlobalPlaylist((prev) => {
					if (prev && prev.length > 0 && prev.some((s) => s.videoId === song.videoId)) return prev;
					return [song];
				});
			}
			setPlayerKey(Date.now());
			setIsPlaying(true);
			try {
				sessionStorage.setItem("moodifyCurrentSong", JSON.stringify(song));
				sessionStorage.setItem("moodifyCurrentPlaylist", JSON.stringify(Array.isArray(playlist) && playlist.length > 0 ? playlist : [song]));
				sessionStorage.setItem("moodifyCurrentIndex", String(index));
				sessionStorage.setItem("moodifyIsPlaying", "true");
				window.MoodifyCurrentVideoId = song.videoId;
				window.dispatchEvent(new CustomEvent("moodify-start", { detail: { videoId: song.videoId } }));
			} catch (err) {}
		};

		window.addEventListener("moodify-play", handler);
		return () => window.removeEventListener("moodify-play", handler);
	}, []);

	// Sync play state
	useEffect(() => {
		const handler = (e) => setIsPlaying(e.detail?.isPlaying || false);
		window.addEventListener("moodify-player-state", handler);
		return () => window.removeEventListener("moodify-player-state", handler);
	}, []);

	// Restore playback time on page focus (helps when tab lost/gain)
	useEffect(() => {
		const handlePageFocus = () => {
			setTimeout(() => {
				try {
					const saved = JSON.parse(sessionStorage.getItem("moodifyCurrentTime"));
					const currentSong = JSON.parse(sessionStorage.getItem("moodifyCurrentSong"));
					if (saved && saved.videoId && currentSong && currentSong.videoId === saved.videoId && saved.currentTime > 0) {
						window.dispatchEvent(new CustomEvent("moodify-seek", { detail: { time: saved.currentTime } }));
					}
				} catch (err) {}
			}, 300);
		};
		window.addEventListener("focus", handlePageFocus);
		return () => window.removeEventListener("focus", handlePageFocus);
	}, []);

	// Hide player on auth pages
	const hidePlayer = ["/login", "/signup", "/"].includes(location.pathname);
	const showPlayer = !hidePlayer;

	// Background element: uses helper to render dots on login/signup and video elsewhere (intro returns null)
	const bg = renderBackground(location.pathname, false);

	return (
		<div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
			{bg}

			<main className="relative z-10 w-full flex flex-col items-center justify-center">{children}</main>

			{showPlayer && <BackgroundVideoPlayer currentSong={globalPlaylist[0]} isPlaying={isPlaying} />}

			{showPlayer && <AudioPlayer key={playerKey} playlist={globalPlaylist} isGlobal={true} />}
		</div>
	);
};

export default PageWrapper;
```