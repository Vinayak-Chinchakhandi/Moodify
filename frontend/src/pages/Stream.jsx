import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import PageWrapper from "../components/PageWrapper";

const Stream = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const { song: navSong, playlist: navPlaylist, index: navIndex } = state || {};
  const containerId = "stream-player-slot";

  const { curSong, curPlaylist, curIndex } = useMemo(() => {
    const savedSong = (() => { try { return JSON.parse(sessionStorage.getItem("moodifyCurrentSong")); } catch { return null; } })();
    const savedPlaylist = (() => { try { return JSON.parse(sessionStorage.getItem("moodifyCurrentPlaylist")); } catch { return null; } })();
    const savedIndex = (() => {
      const n = Number(sessionStorage.getItem("moodifyCurrentIndex"));
      return Number.isFinite(n) ? n : 0;
    })();
    const resolvedSong = navSong || savedSong;
    const resolvedPlaylist = navPlaylist || savedPlaylist || (resolvedSong ? [resolvedSong] : []);
    const resolvedIndex = typeof navIndex === "number" ? navIndex : savedIndex;
    return { curSong: resolvedSong, curPlaylist: resolvedPlaylist, curIndex: resolvedIndex };
  }, [navSong, navPlaylist, navIndex]);

  // iframeSrcBeforePlay: loaded initially but with autoplay=0 to avoid audible autoplay.
  // When user clicks Play, we set playNow=true and load the same src with autoplay=1 (no mute).
  const [playNow, setPlayNow] = useState(false);
  const [iframeKey, setIframeKey] = useState(Date.now()); // to force iframe reload when toggling autoplay

  useEffect(() => {
    if (!curSong) return;

    // persist session info
    try { sessionStorage.setItem("moodifyCurrentSong", JSON.stringify(curSong)); } catch (e) {}
    try { sessionStorage.setItem("moodifyCurrentPlaylist", JSON.stringify(curPlaylist || [])); } catch (e) {}
    try { sessionStorage.setItem("moodifyCurrentIndex", String(curIndex || 0)); } catch (e) {}

    // Immediately pause background audio and persist current time.
    try { window.dispatchEvent(new CustomEvent("moodify-enter-visual-stream", { detail: { song: curSong, playlist: curPlaylist, index: curIndex } })); } catch (err) {}

    // ask background to store current time as well (it already does on enter)
    try { window.dispatchEvent(new CustomEvent("moodify-get-current-time")); } catch (e) {}

    // cleanup: on unmount ask background to resume
    return () => {
      try { window.dispatchEvent(new CustomEvent("moodify-exit-visual-stream", { detail: { resumeBackground: true } })); } catch (err) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curSong, curPlaylist, curIndex]);

  if (!curSong) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-screen text-white">
          <p className="text-2xl">No song selected. Please go back.</p>
        </div>
      </PageWrapper>
    );
  }

  // Build the base embed src (no autoplay, no mute). When user clicks play we'll append autoplay=1.
  const baseEmbed = `https://www.youtube.com/embed/${encodeURIComponent(curSong.videoId)}?rel=0&modestbranding=1&controls=1&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`;

  // If playNow is true we request autoplay=1 (no mute) — this is triggered by user's click
  const activeSrc = playNow ? `${baseEmbed}&autoplay=1` : `${baseEmbed}&autoplay=0`;

  const handleUserPlay = () => {
    // set flag and reload iframe (iframeKey forces reload). This click is a user gesture -> audible allowed.
    setPlayNow(true);
    setIframeKey(Date.now());
    // Also dispatch a control play to background guard (it will already be paused)
    try { window.dispatchEvent(new CustomEvent("moodify-player-state", { detail: { isPlaying: false } })); } catch (e) {}
  };

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-start min-h-screen text-white px-4 py-6 pb-32">
        <div className="w-full max-w-4xl mb-6 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 text-white transition-all text-sm font-medium">← Back</button>
        </div>

        <div className="w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <div id={containerId} className="absolute top-0 left-0 w-full h-full">
              {/* iframe: reloads when iframeKey changes */}
              <iframe
                key={iframeKey}
                title={curSong.title}
                src={activeSrc}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}
              />

              {/* Large centered Play button shown only when audible playback hasn't been started */}
              {!playNow && (
                <div className="absolute inset-0 flex items-center justify-center z-40">
                  <button
                    onClick={handleUserPlay}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xl font-semibold shadow-lg"
                  >
                    ▶ Play Video
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl mt-6 px-4">
          <h2 className="text-3xl font-bold text-white mb-2">{curSong.title}</h2>
          <p className="text-gray-300 text-lg">{curSong.artist}</p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Stream;