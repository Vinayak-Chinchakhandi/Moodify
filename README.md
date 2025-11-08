Mood-Based Music Recommendation Web App – Development Notes

1. Create Project Folder Structure
mood-music-app/
├── backend/
├── frontend/
└── README.md

==========================================================================

2. Initialize Node.js Backend
cd backend
npm init -y
npm install express axios cors dotenv

Dependencies used:

express → Backend web framework
axios → For external API calls
cors → To enable communication with frontend
dotenv → For managing environment variables

=========================================================================

3. Set Up React Frontend
From the root directory:
npx create-react-app frontend
cd frontend
npm install axios react-router-dom

Dependencies used:

axios → For making API requests to backend
react-router-dom → For routing between pages
Remove Redundant Files and Setup Version Control

============================================================================

4. Go back to the root:
cd ..

Remove frontend Git and README (to maintain a single repo):
rm -rf frontend/.git
rm frontend/README.md

Initialize Git in the main project root:
git init

Add and commit the initial setup:
git add .
git commit -m "Initial setup with React and Express"

=================================================================================

5. Create and Configure .gitignore

Create a .gitignore file in the root directory with the following entries:

# ===============================
# Node.js + React Full Stack Ignore Rules
# ===============================

# === Dependencies ===
node_modules/
frontend/node_modules/
backend/node_modules/

# === Build / Dist Outputs ===
frontend/build/
backend/dist/

# === Environment Files ===
.env
frontend/.env
backend/.env
.env.local
.env.development.local
.env.test.local
.env.production.local
frontend/.env.*
backend/.env.*

# === Logs ===
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# === Testing / Coverage ===
frontend/coverage/
backend/coverage/

# === Editor / System Files ===
.vscode/
.idea/
.DS_Store
Thumbs.db

# === Temporary Files ===
*.tmp
*.swp

# === Deployment / Cloud ===
.aws/
*.pem

# === Miscellaneous ===
frontend/.pnp
frontend/.pnp.js
package-lock.json
yarn.lock

# Ignore  README files
README.md

===================================================================================

6. Then, remove extra .gitignore files inside frontend and backend:
rm frontend/.gitignore
rm backend/.gitignore

===================================================================================

7. Set Up Environment Variables

Create .env files in both backend and frontend folders.

backend/.env:
PORT=5000
# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key

frontend/.env:
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_ENV=development

Make sure these .env files are included in .gitignore.

===================================================================================

8. Organize Folder Structure

Final structure (so far):
```bash
moodify/
│
├── backend/
│   ├── node_modules/
│   ├── .env
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   │
│   ├── src/
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   │
│   ├── .env
│   ├── package-lock.json
│   └── package.json
│
├── node_modules/               
├── .env                        
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```
===================================================================================

9. Install Concurrent Runner

This allows both frontend and backend to run together with one command.

Install concurrently: in root
npm install concurrently --save-dev

Modify the root package.json as follows:

{
  "name": "moodify",
  "version": "1.0.0",
  "main": "index.js",
  "license": "ISC",
  "private": true,
  "scripts": {
    "install-all": "npm install --prefix backend && npm install --prefix frontend",
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm start --prefix frontend\""
  },
  "devDependencies": {
    "concurrently": "^9.2.1"
  }
}

Install dependencies of both folder at once
npm run install-all

Now you can start both servers at once:
npm run dev

=====================================================================================

10. complete frontend folder structure
```bash
frontend/
└── src/
    ├── assets/
    │   └── logo.png
    │
    ├── components/
    │   ├── Navbar.jsx
    │   ├── MoodSelector.jsx
    │   ├── SongCard.jsx
    │   ├── ChatInput.jsx
    │   ├── WebcamCapture.jsx
    │   ├── AudioPlayer.jsx
    │   ├── Loader.jsx
    │   ├── ProtectedRoute.jsx
    │   └── PlaylistCard.jsx
    │
    ├── context/
    │   ├── AppContext.js
    │   └── AuthContext.js
    │
    ├── pages/
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── Signup.jsx
    │   ├── MoodDetection.jsx
    │   ├── ChatMood.jsx
    │   ├── Recommendations.jsx
    │   ├── Favorites.jsx
    │   ├── Playlists.jsx
    │   └── History.jsx
    │
    ├── services/
    │   ├── api.js
    │   ├── moodService.js
    │   └── firebase.js
    │
    ├── utils/
    │   └── moodMapping.js
    │
    ├── App.js
    ├── App.css
    ├── index.js
    └── index.css
```

=====================================================================================

11. install firebase in frontend folder

cd frontend
npm install firebase