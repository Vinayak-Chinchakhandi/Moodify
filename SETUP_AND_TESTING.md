# Moodify - Complete Setup & Testing Guide

## ✅ Backend Configuration

### Environment Variables
The backend requires the following API keys in `.env`:

```dotenv
PORT=5000
YT_API_KEY=<Your YouTube API Key>
HF_API_KEY=<Your HuggingFace API Key>
```

**Current Status:**
- ✅ YT_API_KEY: Configured
- ✅ HF_API_KEY: Configured

### Backend Structure

**Routes:**
- `/api/search/songs` - Unified search endpoint (mood, genre, artist, languages)
- `/api/youtube/songs` - Get songs for a mood
- `/api/mood/detect-webcam` - Detect emotion from webcam image
- `/api/artists/search` - Search for artists

**Services:**
- `youtube.service.js` - Fetches songs from YouTube API
- `huggingface.service.js` - Detects emotion using HF models
- `artists.service.js` - Fetches artist data from iTunes

---

## ✅ Frontend Configuration

### Environment Variables (.env)

```dotenv
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=<Firebase API Key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<Firebase Auth Domain>
REACT_APP_FIREBASE_PROJECT_ID=<Firebase Project ID>
REACT_APP_FIREBASE_STORAGE_BUCKET=<Firebase Storage Bucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<Firebase Messaging Sender ID>
REACT_APP_FIREBASE_APP_ID=<Firebase App ID>
```

### Frontend API Services
- **Firestore Service** (`services/firestoreService.js`) - User favorites, playlists, history
- **Emotion Detector** (`utils/hfEmotionDetector.js`) - Webcam mood detection
- **YouTube API** (`services/youtubeApi.js`) - Fetch mood-based songs
- **Artist API** (`services/artistApi.js`) - Search artists

---

## 🚀 How to Run

### 1. **Install Dependencies**

```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. **Start Development Server**

```bash
# From project root
npm run dev
```

This will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

---

## 📱 User Workflows

### 1. **Manual Selection** (Mood + Genre + Artist)
- Navigate to: `/manual-selection`
- User selects:
  - Genre (Pop, Rock, Hip-Hop, etc.)
  - Artist (auto-suggestions)
  - Mood (Happy, Sad, Calm, Energetic, Romantic)
- Calls: `GET /api/search/songs?mood=...&genre=...&artist=...`
- Redirects to: `/recommendations` with search results

### 2. **Mood Detection** (Webcam)
- Navigate to: `/mood-detection`
- User captures webcam image
- Calls: `POST /api/mood/detect-webcam` with image
- Returns: Detected mood (Happy, Sad, Calm, etc.)
- Redirects to: `/recommendations` with detected mood

### 3. **ChatMood** (Questionnaire)
- Navigate to: `/chat-mood`
- User answers mood questions
- Returns: Aggregated mood
- Redirects to: `/recommendations`

### 4. **Recommendations** (Main Results Page)
- Displays: Songs based on selected/detected mood
- Features:
  - Add to Favorites (❤️)
  - Add to Playlists
  - AudioPlayer
  - Load more songs (pagination)
- Calls: `GET /api/search/more?pageToken=...`

### 5. **User Dashboard**
- **Favorites** (`/favorites`) - All liked songs
- **Playlists** (`/playlists`) - User-created playlists
- **History** (`/history`) - Recently played songs
- **Profile** (`/profile`) - User settings & preferences

---

## 🔧 Troubleshooting

### **Issue: YouTube API Returns 400 Bad Request**
**Cause:** API key is `undefined` in backend

**Solution:**
1. Verify `.env` file in `backend/` folder has `YT_API_KEY`
2. Restart backend: `npm run dev`
3. Check logs: Should see "✅ Loaded" for API keys

### **Issue: Mood Detection Returns "Neutral"**
**Cause:** HF API key missing or model loading failed

**Solution:**
1. Verify `HF_API_KEY` in `backend/.env`
2. Check backend logs for model failures
3. Ensure image is valid JPG/PNG format

### **Issue: Proxy ECONNREFUSED**
**Cause:** Backend server not running on port 5000

**Solution:**
1. Ensure `npm run dev` is running both backend + frontend
2. Check if port 5000 is already in use: `netstat -ano | findstr :5000`
3. Kill process if needed and restart

---

## ✅ API Response Formats

### Search Songs Response
```json
{
  "mood": "Happy",
  "genre": "Pop",
  "artist": "Taylor Swift",
  "items": [
    {
      "videoId": "abc123",
      "title": "Song Name",
      "artist": "Channel Name",
      "thumbnail": "https://...",
      "description": "...",
      "publishedAt": "2024-01-01"
    }
  ],
  "nextPageToken": "token123",
  "total": 1000
}
```

### Mood Detection Response
```json
{
  "mood": "Happy"
}
```

---

## 📂 File Structure

**Backend:**
- `server.js` - Express app initialization
- `routes/` - API endpoints
- `controllers/` - Business logic
- `services/` - External API calls
- `utils/` - Helper functions
- `middlewares/` - Express middleware
- `.env` - API keys (DO NOT COMMIT)

**Frontend:**
- `pages/` - Route components
- `components/` - Reusable UI components
- `services/` - API service functions
- `utils/` - Helper functions
- `firebase/` - Firebase configuration
- `context/` - React context for global state
- `.env` - Environment configuration

---

## 🎯 Next Steps

1. ✅ Backend running and returning data
2. ✅ Frontend calling APIs correctly
3. ✅ Mood detection working
4. ✅ Song search & filtering working
5. ✅ Firestore integration for user data
6. ⏳ Test complete end-to-end workflow
7. ⏳ Optimize & deploy
