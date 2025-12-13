Install dependencies of both folder at once
npm run install-all

Now you can start both servers at once:
npm run dev

```bash
COMPLETE STRUCTURE TILL NOW


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
│   │   ├── logger.js(EMPTY)
│   │   ├── moodKeywords.js
│   │   └── response.js(EMPTY)
│   │
│   │── config/(EMPTY)
│   │   └── axiosInstance.js(EMPTY)
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
│   │   │   ├── PageaWrapper.jsx
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
│   │   │   ├── AppContext.js(EMPTY)
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
│   │   │   ├── hfEmotionDetector.js
│   │   │   └── moodMapping.js(EMPTY)
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