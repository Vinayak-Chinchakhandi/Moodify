import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const questions = [
  {
    q: "How happy are you right now?",
    options: ["Not happy at all", "A little happy", "Quite happy", "Very happy"],
  },
  {
    q: "How energetic do you feel?",
    options: ["Exhausted", "Calm", "Alert", "Energized"],
  },
  {
    q: "How relaxed are you?",
    options: ["Very tense", "Somewhat tense", "Somewhat relaxed", "Completely relaxed"],
  },
  {
    q: "How motivated are you today?",
    options: ["Not motivated", "A bit motivated", "Motivated", "Extremely motivated"],
  },
  {
    q: "How social or outgoing do you feel?",
    options: ["Withdrawn", "Quiet", "Open", "Outgoing"],
  },
  {
    q: "How much are you enjoying your day?",
    options: ["Not enjoying", "It's okay", "Pretty good", "Loving it"],
  },
];

const mapAvgToMood = (avg) => {
  if (avg >= 3.2) return "Energetic";
  if (avg >= 2.6) return "Happy";
  if (avg >= 1.9) return "Calm";
  if (avg >= 1.2) return "Sad";
  return "Neutral";
};

const ChatMood = () => {
  const navigate = useNavigate();
  const chatRef = useRef(null);

  // messages: { id, sender: 'bot'|'user', text, meta? }
  const [messages, setMessages] = useState(() => [
    {
      id: "bot-0",
      sender: "bot",
      text: "Hi! 👋 Hello — can we begin the mood check?",
    },
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 = greeting stage
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [typing, setTyping] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [detectedMood, setDetectedMood] = useState(null);
  const [showBackOnNo, setShowBackOnNo] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState(false);
  const [userLanguages, setUserLanguages] = useState([]);

  // auto-scroll when messages/typing change
  useEffect(() => {
    if (!chatRef.current) return;
    setTimeout(() => {
      try {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      } catch (e) {}
    }, 80);
  }, [messages, typing]);

  // load user languages (optional)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!auth.currentUser) return;
        const refDoc = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(refDoc);
        if (!mounted) return;
        if (snap.exists()) {
          const data = snap.data();
          setUserLanguages([data.language1, data.language2, data.language3].filter(Boolean));
        }
      } catch (e) {}
    })();
    return () => (mounted = false);
  }, []);

  const pushMessage = (msg) => setMessages((m) => [...m, { id: `${msg.sender}-${Date.now()}`, ...msg }]);

  const botReplyWithTyping = async (text, delay = 700) => {
    setTyping(true);
    const jitter = Math.floor(Math.random() * 240);
    await new Promise((r) => setTimeout(r, delay + jitter));
    setTyping(false);
    pushMessage({ sender: "bot", text });
  };

  const startQuiz = async () => {
    setShowBackOnNo(false);
    setDisabledOptions(true);
    pushMessage({ sender: "user", text: "Yes — let's start" });
    await botReplyWithTyping("Great! I'll ask a few quick questions. Answer honestly 🙂");
    setAnswers(Array(questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setTimeout(() => {
      pushMessage({ sender: "bot", text: questions[0].q });
      setDisabledOptions(false);
    }, 300);
  };

  const handleNoAtGreeting = async () => {
    setDisabledOptions(true);
    pushMessage({ sender: "user", text: "No, maybe later" });
    await botReplyWithTyping("No problem — come back anytime. 👋");
    // show only Back to Home
    setShowBackOnNo(true);
    setDisabledOptions(false);
  };

  const handleAnswer = async (optionIndex) => {
    if (disabledOptions) return;
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) return;
    setDisabledOptions(true);

    const optionText = questions[currentQuestionIndex].options[optionIndex];
    pushMessage({ sender: "user", text: optionText });

    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentQuestionIndex] = optionIndex + 1;
      return copy;
    });

    await botReplyWithTyping("Got it.");

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setTimeout(() => {
        pushMessage({ sender: "bot", text: questions[nextIndex].q });
        setDisabledOptions(false);
      }, 220);
    } else {
      // completed
      setCompleted(true);
      await botReplyWithTyping("Thanks — analyzing your responses...");
      setTimeout(() => {
        // compute final average correctly using recent update
        const finalAnswers = (() => {
          const copy = [...answers];
          copy[currentQuestionIndex] = optionIndex + 1;
          return copy;
        })();
        const finalSum = finalAnswers.reduce((a, b) => a + (b || 0), 0);
        const avg = finalSum / finalAnswers.length;
        const mood = mapAvgToMood(avg);
        setDetectedMood(mood);
        pushMessage({ sender: "bot", text: `Based on our chat, your mood appears to be:` });
        setTimeout(() => {
          pushMessage({ sender: "bot", text: mood, meta: { highlight: true } });
          setDisabledOptions(false);
        }, 450);
      }, 700);
    }
  };

  const handleRetake = () => {
    setMessages([{ id: "bot-0", sender: "bot", text: "Hi! 👋 Hello — can we begin the mood check?" }]);
    setCurrentQuestionIndex(-1);
    setAnswers(Array(questions.length).fill(null));
    setDetectedMood(null);
    setCompleted(false);
    setShowBackOnNo(false);
  };

  const handleFindSongs = () => {
    const moodToSend = detectedMood || "Neutral";
    navigate("/recommendations", { state: { source: "chat", mood: moodToSend, languages: userLanguages } });
  };

  const handleGreetingChoice = (choice) => {
    if (choice === "yes") startQuiz();
    else handleNoAtGreeting();
  };

  const onOptionClick = (i) => {
    if (currentQuestionIndex === -1) return;
    handleAnswer(i);
  };

  const Bubble = ({ m }) => {
    const isBot = m.sender === "bot";
    const bubbleBase = "max-w-[78%] break-words px-4 py-3 rounded-2xl shadow-sm leading-tight text-sm";
    if (isBot) {
      return (
        <div className="flex w-full my-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 text-black flex items-center justify-center font-bold mr-3">
            🤖
          </div>
          <div className={`${bubbleBase} bg-white/6 text-gray-100`}>
            {m.meta && m.meta.highlight ? (
              <div style={{ display: "inline-block", background: "linear-gradient(90deg,#00ffff,#ff00ff,#ff6600)", WebkitBackgroundClip: "text", color: "transparent" }}>
                <span className="font-extrabold text-2xl">{m.text}</span>
              </div>
            ) : (
              <span>{m.text}</span>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex w-full my-2 justify-end">
          <div className={`${bubbleBase} bg-cyan-500/20 text-white text-right`}>
            {m.text}
          </div>
        </div>
      );
    }
  };

  const Typing = () => (
    <div className="flex w-full my-2">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 text-black flex items-center justify-center font-bold mr-3">
        🤖
      </div>
      <div className="max-w-[50%] px-3 py-2 rounded-2xl bg-white/6 text-gray-100">
        <div className="flex items-end gap-1 h-6">
          <span className="dotLoader inline-block w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "0s" }} />
          <span className="dotLoader inline-block w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "0.12s" }} />
          <span className="dotLoader inline-block w-2 h-2 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "0.24s" }} />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-2xl glass-card p-6 flex flex-col min-h-[620px] backdrop-blur-2xl border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-2xl font-extrabold gradient-text">Mood Check — Chat</h2>
            <div style={{ width: 48 }} />
          </div>

          <div
            ref={chatRef}
            className="flex-1 h-[460px] overflow-y-auto px-3 py-3 rounded-lg mb-4 scroll-smooth"
            aria-live="polite"
          >
            {messages.map((m) => (
              <Bubble key={m.id} m={m} />
            ))}

            {typing && <Typing />}

            {/* Greeting choices: only shown when at greeting stage and NO hasn't been chosen */}
            {currentQuestionIndex === -1 && !typing && !showBackOnNo && !completed && (
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => handleGreetingChoice("yes")}
                  disabled={disabledOptions}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 text-white font-semibold"
                >
                  Yes — Start
                </button>

                <button
                  onClick={() => handleGreetingChoice("no")}
                  disabled={disabledOptions}
                  className="px-4 py-2 rounded-full border border-white/30 text-gray-200"
                >
                  No — Maybe later
                </button>
              </div>
            )}

            {/* If user clicked No -> only show Back to Home here */}
            {showBackOnNo && (
              <div className="mt-4">
                <Link to="/home" className="px-8 py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all">
                  ⬅ Back to Home
                </Link>
              </div>
            )}

            {/* Question options: show only while in question flow and NOT after completion */}
            {currentQuestionIndex >= 0 && currentQuestionIndex < questions.length && !typing && !completed && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {questions[currentQuestionIndex].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => onOptionClick(i)}
                    disabled={disabledOptions}
                    className="text-left px-4 py-3 rounded-xl text-sm font-semibold border border-white/10 bg-white/8 hover:bg-white/16 transition"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* bottom control area */}
          <div className="mt-2">
            {/* show final action buttons only when completed */}
            {completed && detectedMood && (
              <div className="flex w-full items-center justify-center gap-3">
                <button onClick={handleFindSongs} className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 text-white font-semibold">
                  Find Songs
                </button>
                <button onClick={handleRetake} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-gray-200">
                  Retake
                </button>
                <Link to="/home" className="px-8 py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 text-gray-300 hover:text-cyan-400 transition-all">
                  ⬅ Back to Home
                </Link>
              </div>
            )}

            {!completed && currentQuestionIndex >= 0 && (
              <div className="text-xs text-gray-400 mt-3 text-center">Select one option for each question — results are instant.</div>
            )}

            {currentQuestionIndex === -1 && !showBackOnNo && (
              <div className="text-xs text-gray-400 mt-3 text-center">This quick chat helps us recommend songs that fit your mood.</div>
            )}
          </div>

          {/* EMPTY spacer card to prevent footer overlap with action buttons (audio player) */}
          <div className="mt-4">
            <div className="glass-card w-full rounded-lg p-2 border border-white/6" style={{ height: 88 }}>
              {/* empty block - reserved space so footer doesn't hide action buttons */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMood;