import { useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const Stream = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location || {};
  const { song } = state || {};

  if (!song) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-screen text-white">
          <p className="text-2xl">No song selected. Please go back.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-col items-center justify-start min-h-screen text-white px-4 py-6">
        {/* Back Button - Top Left */}
        <div className="w-full max-w-4xl mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 text-white transition-all text-sm font-medium"
          >
            ← Back
          </button>
        </div>

        {/* Video Container - Plain */}
        <div className="w-full max-w-4xl bg-black rounded-lg overflow-hidden shadow-2xl">
          {/* 16:9 Aspect Ratio Container */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${song.videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&iv_load_policy=3&fs=0&disablekb=1`}
              title={song.title}
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ border: "none" }}
            />
          </div>
        </div>

        {/* Song Info - Below Video */}
        <div className="w-full max-w-4xl mt-6 px-4">
          <h2 className="text-3xl font-bold text-white mb-2">{song.title}</h2>
          <p className="text-gray-300 text-lg">{song.artist}</p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Stream;
