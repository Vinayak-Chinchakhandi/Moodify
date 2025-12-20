import { useEffect, useRef } from "react";

const isValidVideoId = (id) => typeof id === "string" && id.trim().length >= 3;

const BackgroundVideoPlayer = () => {
  const playerRef = useRef(null);
  const videoIdRef = useRef(null);
  const intervalRef = useRef(null);

  const ensureGlobal = () => {
    if (!window.__MOODIFY_YT_PLAYER) {
      window.__MOODIFY_YT_PLAYER = {
        player: null,
        ready: false,
        created: false,
        queued: [],
        videoId: null,
        playlist: null,
        index: 0,
      };
    }
    return window.__MOODIFY_YT_PLAYER;
  };

  useEffect(() => {
    const global = ensureGlobal();

    const tryCreate = () => {
      if (global.created) {
        playerRef.current = global.player;
        return;
      }
      if (window.YT) {
        const container = document.getElementById("background-player-hidden");
        if (!container) return;
        try {
          global.player = new window.YT.Player("background-player-hidden", {
            height: 1,
            width: 1,
            playerVars: {
              autoplay: 0,
              controls: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
              enablejsapi: 1,
              origin: window.location.origin,
              playsinline: 1,
            },
            events: {
              onReady: () => {
                global.ready = true;
                playerRef.current = global.player;
                (global.queued || []).forEach((fn) => { try { fn(); } catch (e) {} });
                global.queued = [];
                try { window.dispatchEvent(new CustomEvent("moodify-player-ready-temp")); } catch (e) {}
                // restore persisted volume if available
                try {
                  const v = Number(sessionStorage.getItem("moodifyVolume"));
                  if (!Number.isNaN(v) && typeof playerRef.current.setVolume === 'function') {
                    playerRef.current.setVolume(Number(v));
                  }
                } catch (e) {}
                console.log("YouTube player ready (global)");
              },
              onStateChange: (e) => {
                const stateMap = { 0: "ended", 1: "playing", 2: "paused", 3: "buffering", 5: "cued" };
                const st = stateMap[e.data] || "unknown";
                window.dispatchEvent(new CustomEvent("moodify-video-state", { detail: { state: st, isPlaying: e.data === 1 } }));
                if (e.data === 1) startTimeBroadcast();
                if (e.data === 2 || e.data === 0) stopTimeBroadcast();
                if (e.data === 0) {
                  // auto-advance
                  const g = ensureGlobal();
                  const p = g.playlist || [];
                  if (p && p.length > 0) {
                    const nextIdx = (Number(g.index || 0) + 1) % p.length;
                    g.index = nextIdx;
                    const next = p[nextIdx];
                    window.dispatchEvent(new CustomEvent("moodify-next-track-internal", { detail: { song: next, playlist: p, index: nextIdx } }));
                  }
                }
              },
              onError: (err) => {
                console.error("YouTube player error:", err && err.data);
              },
            },
          });
          global.created = true;
          console.log("BackgroundVideoPlayer created (global)");
        } catch (err) {
          console.error("Failed to create YouTube player:", err);
        }
      } else {
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          tag.async = true;
          document.head.appendChild(tag);
        }
      }
    };

    tryCreate();
    const poll = setInterval(() => {
      tryCreate();
      if (ensureGlobal().created) clearInterval(poll);
    }, 200);

    return () => clearInterval(poll);
  }, []);

  const startTimeBroadcast = () => {
    stopTimeBroadcast();
    intervalRef.current = setInterval(() => {
      try {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
          const t = playerRef.current.getCurrentTime();
          const vid = videoIdRef.current || null;
          window.dispatchEvent(new CustomEvent("moodify-current-time", { detail: { currentTime: t, videoId: vid } }));
          try { sessionStorage.setItem("moodifyCurrentTime", JSON.stringify({ currentTime: t, videoId: vid })); } catch {}
        }
      } catch (e) {}
    }, 1000);
  };
  const stopTimeBroadcast = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const callWhenReady = (fn) => {
    const global = ensureGlobal();
    if (global.ready && playerRef.current) {
      try { fn(); } catch (e) {}
    } else {
      global.queued = global.queued || [];
      global.queued.push(fn);
    }
  };

  useEffect(() => {
    const handlePlayCmd = (e) => {
      const { song, playlist, index } = e.detail || {};
      const g = ensureGlobal();
      if (playlist && Array.isArray(playlist) && playlist.length > 0) g.playlist = playlist;
      else if (song) g.playlist = [song];
      g.index = typeof index === "number" ? index : (g.playlist ? g.playlist.findIndex(s => s.videoId === (song && song.videoId)) : 0);
      const vid = song?.videoId || (g.playlist && g.playlist[g.index]?.videoId) || null;
      if (!vid) return;
      videoIdRef.current = vid;
      ensureGlobal().videoId = vid;
      try { sessionStorage.setItem("moodifyCurrentSong", JSON.stringify(song)); sessionStorage.setItem("moodifyCurrentPlaylist", JSON.stringify(g.playlist || [])); sessionStorage.setItem("moodifyCurrentIndex", String(g.index || 0)); } catch (e) {}
      callWhenReady(() => {
        try {
          playerRef.current.loadVideoById(vid);
          window.dispatchEvent(new CustomEvent("moodify-video-loaded", { detail: { videoId: vid } }));
          playerRef.current.playVideo();
          try { sessionStorage.setItem("moodifyIsPlaying", "true"); } catch (e) {}
        } catch (err) {
          try { playerRef.current.cueVideoById(vid); } catch (e) {}
        }
      });
    };

    const handleNext = () => {
      const g = ensureGlobal();
      const p = g.playlist || [];
      if (!p || p.length === 0) return;
      const nextIndex = (Number(g.index || 0) + 1) % p.length;
      g.index = nextIndex;
      const next = p[nextIndex];
      if (!next) return;
      window.dispatchEvent(new CustomEvent("moodify-play", { detail: { song: next, playlist: p, index: nextIndex } }));
    };

    const handlePrev = () => {
      const g = ensureGlobal();
      const p = g.playlist || [];
      if (!p || p.length === 0) return;
      const prevIndex = (Number(g.index || 0) - 1 + p.length) % p.length;
      g.index = prevIndex;
      const prev = p[prevIndex];
      if (!prev) return;
      window.dispatchEvent(new CustomEvent("moodify-play", { detail: { song: prev, playlist: p, index: prevIndex } }));
    };

    const handleEnterVisualStream = () => {
      // guard: set active flag so only this flow resumes later
      try { window.__MOODIFY_VISUAL_STREAM_ACTIVE = true; } catch (e) {}
      callWhenReady(() => {
        try {
          if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
            const t = playerRef.current.getCurrentTime();
            const vid = videoIdRef.current || null;
            try { sessionStorage.setItem("moodifyCurrentTime", JSON.stringify({ currentTime: t, videoId: vid })); } catch {}
          }
        } catch (_) {}
        try { if (playerRef.current && typeof playerRef.current.pauseVideo === "function") playerRef.current.pauseVideo(); } catch (err) {}
        window.dispatchEvent(new CustomEvent("moodify-player-state", { detail: { isPlaying: false } }));
      });
    };

    const handleExitVisualStream = () => {
      // only resume if we set the active flag earlier
      const wasActive = Boolean(window.__MOODIFY_VISUAL_STREAM_ACTIVE);
      try { window.__MOODIFY_VISUAL_STREAM_ACTIVE = false; } catch (e) {}
      if (!wasActive) return;
      callWhenReady(() => {
        try {
          const saved = JSON.parse(sessionStorage.getItem("moodifyCurrentTime") || "null");
          if (saved && saved.videoId && saved.currentTime && saved.videoId === videoIdRef.current) {
            try { if (typeof playerRef.current.seekTo === "function") playerRef.current.seekTo(Number(saved.currentTime) || 0, true); } catch (e) {}
          }
          try { if (playerRef.current && typeof playerRef.current.playVideo === "function") playerRef.current.playVideo(); } catch (err) {}
          window.dispatchEvent(new CustomEvent("moodify-player-state", { detail: { isPlaying: true } }));
        } catch (err) {
          console.error("Failed to resume after visual stream exit:", err);
        }
      });
    };

    const handleControlPlayPause = (e) => {
      const isPlaying = Boolean(e.detail?.isPlaying);
      if (isPlaying) {
        callWhenReady(() => { try { playerRef.current.playVideo(); } catch (err) {} });
      } else {
        callWhenReady(() => { try { playerRef.current.pauseVideo(); } catch (err) {} });
      }
    };

    window.addEventListener("moodify-play", handlePlayCmd);
    window.addEventListener("moodify-next-track", handleNext);
    window.addEventListener("moodify-prev-track", handlePrev);
    window.addEventListener("moodify-enter-visual-stream", handleEnterVisualStream);
    window.addEventListener("moodify-exit-visual-stream", handleExitVisualStream);
    window.addEventListener("moodify-control-play-pause", handleControlPlayPause);
    // volume control: expects detail.volume in 0..1
    const handleVolume = (e) => {
      const v = Number(e?.detail?.volume);
      if (Number.isNaN(v)) return;
      const vol100 = Math.max(0, Math.min(1, v)) * 100;
      callWhenReady(() => {
        try { if (playerRef.current && typeof playerRef.current.setVolume === 'function') playerRef.current.setVolume(Math.round(vol100)); } catch (err) {}
      });
    };
    window.addEventListener("moodify-volume", handleVolume);

    const handleInternalNext = (e) => {
      const { song: s, playlist: p, index } = e.detail || {};
      if (s) {
        window.dispatchEvent(new CustomEvent("moodify-play", { detail: { song: s, playlist: p, index } }));
      }
    };
    window.addEventListener("moodify-next-track-internal", handleInternalNext);

    return () => {
      window.removeEventListener("moodify-play", handlePlayCmd);
      window.removeEventListener("moodify-next-track", handleNext);
      window.removeEventListener("moodify-prev-track", handlePrev);
      window.removeEventListener("moodify-enter-visual-stream", handleEnterVisualStream);
      window.removeEventListener("moodify-exit-visual-stream", handleExitVisualStream);
      window.removeEventListener("moodify-control-play-pause", handleControlPlayPause);
      window.removeEventListener("moodify-volume", handleVolume);
      window.removeEventListener("moodify-next-track-internal", handleInternalNext);
    };
  }, []);

  useEffect(() => {
    const global = ensureGlobal();
    const tryLoadSaved = () => {
      const vid = global.videoId;
      if (!isValidVideoId(vid)) return;
      callWhenReady(() => {
        try {
          if (videoIdRef.current !== vid) {
            videoIdRef.current = vid;
            if (playerRef.current && typeof playerRef.current.loadVideoById === "function") {
              playerRef.current.loadVideoById(vid);
            } else {
              try { playerRef.current.cueVideoById(vid); } catch (e) {}
            }
            window.dispatchEvent(new CustomEvent("moodify-video-loaded", { detail: { videoId: vid } }));
          }
        } catch (err) { console.error("Error loading video:", err); }
      });
    };

    tryLoadSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div id="background-player-hidden" style={{ display: "block", visibility: "hidden", width: 1, height: 1, overflow: "hidden", position: "absolute", left: "-9999px", top: "-9999px" }} />
      <div id="background-player" style={{ display: "none" }} />
    </>
  );
};

export default BackgroundVideoPlayer;
