// // src/components/PageWrapper.jsx
// import React, { useMemo, useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import AudioPlayer from "./AudioPlayer";
// import BackgroundVideoPlayer from "./BackgroundVideoPlayer";
// import { auth, db } from "../firebase/firebase";
// import { doc, onSnapshot } from "firebase/firestore";

// const PageWrapper = ({ children }) => {
//   const location = useLocation();

//   const notes = useMemo(() => {
//     const symbols = ["🎵", "🎶", "♩", "♪", "♬"];
//     const colors = ["#00FFFF", "#FF00FF", "#FFD700", "#00FF9C", "#FF6EC7"];
//     return Array.from({ length: 20 }).map((_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       color: colors[Math.floor(Math.random() * colors.length)],
//       symbol: symbols[Math.floor(Math.random() * symbols.length)],
//       duration: 18 + Math.random() * 10,
//       delay: Math.random() * 10,
//       driftX: Math.random() * 60 - 30,
//       driftY: Math.random() * 40 - 20,
//       rotate: Math.random() * 30 - 15,
//     }));
//   }, []);

//   const [globalPlaylist, setGlobalPlaylist] = useState([]);
//   const [playerKey, setPlayerKey] = useState(Date.now());
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [recentlySongs, setRecentlySongs] = useState([]);

//   // Load user history for default playlist (unchanged)
//   useEffect(() => {
//     if (!auth.currentUser) return;
//     const userDocRef = doc(db, "users", auth.currentUser.uid);
//     const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         const history = data.history || [];
//         setRecentlySongs(history);
//         if (globalPlaylist.length === 0 && history.length > 0) {
//           setGlobalPlaylist(history.slice(0, 5));
//         }
//       }
//     });
//     return () => unsubscribe();
//   }, [globalPlaylist.length]);

//   // Restore from sessionStorage on mount
//   useEffect(() => {
//     try {
//       const savedPlaylist = JSON.parse(sessionStorage.getItem("moodifyCurrentPlaylist"));
//       const savedSong = JSON.parse(sessionStorage.getItem("moodifyCurrentSong"));
//       const savedIndex = Number(sessionStorage.getItem("moodifyCurrentIndex")) || 0;
//       const savedPlaying = sessionStorage.getItem("moodifyIsPlaying") === "true";
//       if (Array.isArray(savedPlaylist) && savedPlaylist.length > 0) {
//         setGlobalPlaylist(savedPlaylist);
//         setPlayerKey(Date.now());
//         setIsPlaying(savedPlaying);
//         try { window.dispatchEvent(new CustomEvent("moodify-start", { detail: { videoId: savedSong?.videoId } })); } catch {}
//       } else if (savedSong && savedSong.videoId) {
//         setGlobalPlaylist([savedSong]);
//         setPlayerKey(Date.now());
//         setIsPlaying(savedPlaying);
//         try { window.dispatchEvent(new CustomEvent("moodify-start", { detail: { videoId: savedSong.videoId } })); } catch {}
//       }
//     } catch (err) {}
//   }, []);

//   // Handle moodify-play events: accept { song, playlist, index }
//   useEffect(() => {
//     const handler = (e) => {
//       const song = e.detail?.song;
//       const playlist = e.detail?.playlist;
//       const index = typeof e.detail?.index === "number" ? e.detail.index : 0;
//       if (!song || !song.videoId) {
//         console.warn("moodify-play ignored: invalid song", e.detail);
//         return;
//       }
//       if (Array.isArray(playlist) && playlist.length > 0) {
//         setGlobalPlaylist(playlist);
//       } else {
//         // if no playlist passed, keep previous playlist if song exists there, else use single-song playlist
//         setGlobalPlaylist((prev) => {
//           if (prev && prev.length > 0 && prev.some((s) => s.videoId === song.videoId)) return prev;
//           return [song];
//         });
//       }
//       setPlayerKey(Date.now());
//       setIsPlaying(true);
//       try {
//         sessionStorage.setItem("moodifyCurrentSong", JSON.stringify(song));
//         sessionStorage.setItem("moodifyCurrentPlaylist", JSON.stringify(Array.isArray(playlist) && playlist.length > 0 ? playlist : [song]));
//         sessionStorage.setItem("moodifyCurrentIndex", String(index));
//         sessionStorage.setItem("moodifyIsPlaying", "true");
//         window.MoodifyCurrentVideoId = song.videoId;
//         window.dispatchEvent(new CustomEvent("moodify-start", { detail: { videoId: song.videoId } }));
//       } catch (err) {}
//     };

//     window.addEventListener("moodify-play", handler);
//     return () => window.removeEventListener("moodify-play", handler);
//   }, []);

//   // Sync play state
//   useEffect(() => {
//     const handler = (e) => setIsPlaying(e.detail?.isPlaying || false);
//     window.addEventListener("moodify-player-state", handler);
//     return () => window.removeEventListener("moodify-player-state", handler);
//   }, []);

//   // Restore playback time on page focus (helps when tab lost/gain)
//   useEffect(() => {
//     const handlePageFocus = () => {
//       setTimeout(() => {
//         try {
//           const saved = JSON.parse(sessionStorage.getItem("moodifyCurrentTime"));
//           const currentSong = JSON.parse(sessionStorage.getItem("moodifyCurrentSong"));
//           if (saved && saved.videoId && currentSong && currentSong.videoId === saved.videoId && saved.currentTime > 0) {
//             window.dispatchEvent(new CustomEvent("moodify-seek", { detail: { time: saved.currentTime } }));
//           }
//         } catch (err) {}
//       }, 300);
//     };
//     window.addEventListener("focus", handlePageFocus);
//     return () => window.removeEventListener("focus", handlePageFocus);
//   }, []);

//   // Hide player on auth pages
//   const hidePlayer = ["/login", "/signup", "/"].includes(location.pathname);
//   const showPlayer = !hidePlayer;

//   return (
//     <div className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden">
//       {location.pathname !== "/intro" && (
//         <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none bg-[radial-gradient(circle_at_center,#0a0a1a,#000)]">
//           {notes.map((n) => (
//             <span key={n.id} style={{ position: "absolute", top: `${n.y}%`, left: `${n.x}%`, fontSize: "26px", color: n.color, opacity: 0.85, animation: `floatNote-${n.id} ${n.duration}s ease-in-out ${n.delay}s infinite alternate` }}>
//               {n.symbol}
//             </span>
//           ))}

//           <style>{notes.map((n) => `
//                 @keyframes floatNote-${n.id} {
//                   0% { transform: translate(0px, 0px) scale(1) rotate(0deg); opacity: 0.8; }
//                   50% { transform: translate(${n.driftX}px, ${n.driftY}px) scale(1.1) rotate(${n.rotate}deg); opacity: 1; }
//                   100% { transform: translate(${-n.driftX}px, ${-n.driftY}px) scale(1) rotate(${-n.rotate}deg); opacity: 0.8; }
//                 }`).join("\n")}</style>
//         </div>
//       )}

//       <main className="relative z-10 w-full flex flex-col items-center justify-center">{children}</main>

//       {showPlayer && <BackgroundVideoPlayer currentSong={globalPlaylist[0]} isPlaying={isPlaying} />}

//       {showPlayer && <AudioPlayer key={playerKey} playlist={globalPlaylist} isGlobal={true} />}
//     </div>
//   );
// };

// export default PageWrapper;





import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AudioPlayer from "./AudioPlayer";
import BackgroundVideoPlayer from "./BackgroundVideoPlayer";
import introVideo from "../assets/intro1.mp4";
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