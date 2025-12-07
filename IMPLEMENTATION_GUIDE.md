# Moodify Full Integration Setup & Testing Guide

## ✅ Completed Implementation

### Backend (Node.js/Express)
- **Search API** (`/api/search/songs`): Unified endpoint accepting mood + genre + artist + languages
- **Pagination** (`/api/search/more`): Fetch next page of results
- **YouTube Integration**: Fetches videos and normalizes results
- **Mood Keywords**: Maps mood to YouTube search queries

### Frontend Components
- **Recommendations Page**: 
  - Dynamic scrollable grid (responsive: 1-4 columns)
  - Fixed footer with AudioPlayer, Back, and Find More buttons
  - Favorites toggle, playlist creation/selection
  - Play song recording to history
  
- **Stream Page**: Fullscreen YouTube embed with back navigation
  
- **MoodDetection**: Added Retake button for UX improvement
  
- **ManualSelection**: Normalized mood/genre handling
  
- **ChatMood**: Already integrated with recommendations

### Firestore Utilities
- `addToFavorites()` / `removeFromFavorites()`
- `addToPlaylist()` / `createPlaylist()`
- `addToHistory()`
- `getUserPlaylists()` / `getUserFavorites()` / `getUserHistory()`

---

## 🔧 Setup & Environment Configuration

### 1. Backend (.env)
```
PORT=5000
YT_API_KEY=your_youtube_data_api_key_here
HF_API_KEY=your_hugging_face_api_key_here
```

### 2. Frontend (.env or hardcoded for now)
API endpoints assume backend running on `http://localhost:5000`

---

## 🚀 How to Run

### Start Backend
```bash
cd d:\PROJECTS\Moodify\backend
npm install
npm run dev
```
Server runs on `http://localhost:5000`

### Start Frontend
```bash
cd d:\PROJECTS\Moodify\frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

---

## 🧪 Testing Workflow

### Scenario 1: Manual Selection
1. Click "Manual Selection" from Home
2. Select **Genre**: Pop
3. Enter **Artist**: Taylor Swift (or any artist name)
4. Select **Mood**: Happy
5. Click "Recommend Songs 🎶"
6. **Expected**: 
   - Loads 20 songs from YouTube
   - Displays in 4-column grid
   - Can click "Find More" to paginate
   - Like/unlike songs
   - Add songs to playlists
   - Click song thumbnail to open Stream (fullscreen YouTube)
   - Back button returns to recommendations

### Scenario 2: Mood Detection (Facial)
1. Click "Mood Detection" from Home
2. Allow camera access
3. Show face to webcam
4. Wait for mood detection (HF API call)
5. Click "Recommend Songs 🎶" or "Retake"
6. **Expected**: Same as Scenario 1, but mood is detected from face

### Scenario 3: Chat Mood (Questionnaire)
1. Click "Chat Mood" from Home
2. Answer 6 questions (one at a time)
3. Click "Detect Mood"
4. See detected mood
5. Click "Find Songs" to go to recommendations
6. **Expected**: Same as Scenario 1, but mood from quiz answers

### Scenario 4: Playlist & History
1. In Recommendations, click "+ Playlist" on any song
2. **Expected**:
   - Shows existing playlists (if any)
   - Option to create new playlist
   - Modal closes, song added to playlist
   - Verify in Firestore `users/{uid}.playlists`

3. Click "▶ Play" on any song
4. Song auto-added to history
5. Verify in `users/{uid}.history`

### Scenario 5: Favorites
1. Click "🤍 Like" on any song
2. Button changes to "❤️ Liked"
3. Click again to unlike
4. Verify in Firestore `users/{uid}.favorites`

---

## 🔗 API Endpoints (Backend)

### Search Songs
**GET** `/api/search/songs`

Query Parameters:
- `mood` (required): Happy, Sad, Calm, Energetic, Romantic, Neutral
- `genre` (optional): Pop, Rock, Jazz, etc.
- `artist` (optional): Artist name
- `languages` (optional): Comma-separated language codes (en, es, fr, etc.)
- `pageToken` (optional): For pagination

**Response**:
```json
{
  "mood": "Happy",
  "genre": "Pop",
  "artist": "Taylor Swift",
  "languages": ["en", "es"],
  "items": [
    {
      "videoId": "abc123",
      "title": "Song Title",
      "artist": "Channel Name",
      "thumbnail": "https://...",
      "description": "...",
      "publishedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "nextPageToken": "CDIQAA",
  "total": 10000
}
```

### Get More Songs (Pagination)
**GET** `/api/search/more`

Query Parameters: Same as `/api/search/songs` + `pageToken` (required)

---

## 📱 Firestore Schema (Expected)

### User Document
```
users/{uid}
├── email: string
├── name: string
├── profilePic: string
├── language1, language2, language3: string
├── favorites: [
│   ├── videoId: string
│   ├── title: string
│   ├── artist: string
│   ├── thumbnail: string
│   └── addedAt: timestamp
│ ]
├── playlists: [
│   ├── name: string
│   ├── createdAt: timestamp
│   └── songs: [ {videoId, title, artist, thumbnail, addedAt} ]
│ ]
└── history: [
    ├── videoId: string
    ├── title: string
    ├── artist: string
    ├── thumbnail: string
    └── playedAt: timestamp
  ]
```

---

## ⚠️ Known Issues & TODO

### Phase 3: HF API Integration (Not Yet Implemented)
- MoodDetection page still uses mock emotion detection
- Need to integrate HuggingFace face detection API
- Endpoint: `/api/mood/detect-hf` (POST with image blob)

### Phase 8: AudioPlayer Enhanced Features
- Current AudioPlayer doesn't expose Like/Playlist buttons
- Need to enhance AudioPlayer component to accept `onLike` and `onAddPlaylist` callbacks
- Or embed action buttons next to the player in Recommendations

### Phase 11-12: Testing & Polish
- Add error boundaries and fallback UI
- Add loading skeletons for grid
- Retry logic for failed API calls
- Rate-limit handling

---

## 🛠️ Quick Fixes Needed

1. **AudioPlayer Component**: Add props for `onLike` and `onAddPlaylist` callbacks
2. **MoodDetection**: Uncomment/implement HF API call in `detectEmotionFromBlob`
3. **Firestore Rules**: Add security rules to prevent unauthorized writes
4. **API Proxy**: Consider hosting backend on a public URL (for production)

---

## 🔐 Security Checklist

- [ ] YouTube API key never exposed on frontend
- [ ] HF API key only used on backend
- [ ] Firestore rules prevent cross-user access
- [ ] Auth guard on protected routes
- [ ] Rate limiting on backend endpoints

---

## 📊 Metrics to Track

- Song search time (aim: <2s)
- Grid render time (aim: <1s)
- Pagination responsiveness
- Favorite/playlist add latency
- Error rates

---

## 📝 Notes

- Grid is fully responsive: 1 col (mobile), 2 cols (tablet), 3-4 cols (desktop)
- Scrollbar is custom-styled with cyan accent
- Stream page opens fullscreen, preserves previous scroll state
- All Firestore writes are non-blocking to improve UX
- Songs are fetched on-demand; no pre-caching for now
