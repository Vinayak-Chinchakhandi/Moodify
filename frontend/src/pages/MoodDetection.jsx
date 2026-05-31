import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import WebcamCapture from "../components/WebcamCapture";
import { detectEmotionFromBlob } from "../utils/hfEmotionDetector";

const MoodDetection = () => {
  const [mood, setMood] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detected, setDetected] = useState(false);
  const navigate = useNavigate();

  const detectionLock = useRef(false);

  const handleFrame = async (blob) => {
    if (detectionLock.current || detected) return;

    detectionLock.current = true;
    setIsDetecting(true);

    const emotion = await detectEmotionFromBlob(blob);

    setMood(emotion);
    setDetected(true);
    // Stop camera immediately when detection is done
    try { window.dispatchEvent(new Event('moodify-stop-camera')); } catch (e) { }
    setIsDetecting(false);
  };

  const goToRecommendations = () => {
    if (!mood) return;

    // fetch user languages to pass along and avoid race on Recommendations
    (async () => {
      let langs = [];
      try {
        if (auth.currentUser) {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            langs = [data.language1, data.language2, data.language3].filter(Boolean);
          }
        }
      } catch (e) {
        console.error("Could not fetch user languages:", e);
      }

      navigate("/recommendations", { state: { source: "mood", mood, languages: langs } });
    })();
  };

  const handleRetake = () => {
    setMood(null);
    setDetected(false);
    detectionLock.current = false;
  };

  return (
    <>
      <div
        className="
flex
flex-col
items-center
justify-center
min-h-screen
text-white
px-3
sm:px-4
md:px-6
py-6
sm:py-8
"
      >
        <div className="
relative
z-10
w-full
max-w-4xl
glass-card
p-5
sm:p-6
md:p-8
text-center
backdrop-blur-2xl
border
border-white/10
rounded-2xl
sm:rounded-3xl
">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 gradient-text">
            Facial Mood Detection 🎭
          </h2>

          <p
            className="
text-sm
sm:text-base
text-gray-300
mb-6
leading-relaxed
max-w-2xl
mx-auto
"
          >
            Use your webcam to detect your mood in real-time. After detection, get personalized music recommendations.
          </p>

          <div
            className="
flex
justify-center
items-center
mb-6
w-full
overflow-hidden
"
          >
            {!detected && <WebcamCapture onFrame={handleFrame} />}
          </div>

          {isDetecting && <p
            className="
text-sm
sm:text-base
text-gray-300
animate-pulse
"
          >Detecting mood... ✨</p>}

          {mood && (
            <div className="mb-4">
              <p
                className="
text-base
sm:text-lg
text-cyan-300
mb-4
animate-fadeIn
break-words
"
              >Detected Mood: <span className="text-pink-400">{mood}</span>
              </p>

              <div
                className="
flex
flex-col
sm:flex-row
gap-3
justify-center
items-center
w-full
"
              >                <button
                onClick={goToRecommendations}
                className="
w-full
sm:w-auto
px-6
sm:px-8
py-3
rounded-full
font-semibold
bg-gradient-to-r
from-cyan-500
via-pink-500
to-orange-400
hover:scale-105
transition-transform
"              >
                  Find Songs 🎶
                </button>

                <button
                  onClick={handleRetake}
                  className="
w-full
sm:w-auto
px-6
sm:px-8
py-3
rounded-full
font-semibold
bg-white/10
border
border-white/20
hover:bg-white/20
text-gray-300
transition-all
"                >
                  Retake
                </button>
              </div>
            </div>
          )}

          <div
            className="
flex
justify-center
mt-5
sm:mt-6
w-full
"
          >            <button
            onClick={() => navigate("/home")}
            className="
w-full
sm:w-auto
px-6
sm:px-8
py-3
rounded-full
font-semibold
bg-white/10
border
border-white/20
hover:bg-white/20
text-gray-300
hover:text-cyan-400
transition-all
"          >
              ⬅ Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoodDetection;