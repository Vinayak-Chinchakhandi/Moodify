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
