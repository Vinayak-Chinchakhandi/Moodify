# Moodify - Pre-Testing Checklist

## Backend Setup ✓

### Environment Variables
- [x] `HF_API_KEY` set in `backend/.env`
- [x] `YT_API_KEY` set in `backend/.env`
- [x] `PORT=5000` configured

### Routes Registered
- [x] `/api/search/songs` - Song search endpoint
- [x] `/api/search/more` - Pagination endpoint
- [x] `/api/mood/detect-webcam` - Webcam emotion detection

### Services Available
- [x] HuggingFace service with 3 fallback models
- [x] YouTube API wrapper
- [x] Mood keyword mapping

### Database
- [x] Firebase configured
- [x] Firestore initialized
- [x] Collections: users, playlists, favorites, history (per-user)

---

## Frontend Setup ✓

### Pages Implemented
- [x] Home - Navigation hub
- [x] Login/Signup - Firebase auth
- [x] Profile - User settings + languages
- [x] ChatMood - 4-question questionnaire
- [x] ManualSelection - Mood/Genre/Artist picker
- [x] MoodDetection - Webcam emotion detection
- [x] Recommendations - Dynamic grid with fixed footer
- [x] Stream - Fullscreen YouTube embed
- [x] Favorites - Liked songs grid
- [x] Playlists - User's created playlists
- [x] History - Recent plays

### Components Enhanced
- [x] AudioPlayer - Like/Playlist buttons added
- [x] WebcamCapture - Webcam access for mood detection
- [x] SongCard - Like/Playlist/Play buttons
- [x] PageWrapper - Navigation wrapper
- [x] ProtectedRoute - Auth guard

### Services Created
- [x] firestoreService.js - All Firestore CRUD
- [x] hfEmotionDetector.js - Frontend emotion API
- [x] api.js - Backend API calls
- [x] moodService.js - Mood-related utilities

### Styling Applied
- [x] Tailwind CSS responsive grid
- [x] Glass-morphism cards
- [x] Gradient text and buttons
- [x] Custom scrollbar
- [x] Mobile-first design (1-4 columns)
- [x] Fixed footer layout

---

## Data Flow ✓

### ChatMood Flow
```
ChatMood (Answer 4 Qs) 
  → Detected Mood 
  → Recommendations (/api/search/songs)
  → Display 20 songs
  → Like/Playlist/Stream options
```

### ManualSelection Flow
```
ManualSelection (Pick mood/genre/artist)
  → Build search params
  → Recommendations (/api/search/songs)
  → Display 20 songs
  → Like/Playlist/Stream options
```

### MoodDetection Flow
```
WebcamCapture (Smile/Make expression)
  → Detected emotion
  → Convert to mood (Happy/Sad/Calm/Energetic)
  → Recommendations (/api/search/songs)
  → Display 20 songs
  → Like/Playlist/Stream options
```

### Firestore Data Persistence
```
User Action (Like) → Firestore write → Data persists
User Action (Playlist add) → Firestore write → Data persists
User Action (Play) → History recorded → Firestore write
Logout/Login → Read from Firestore → Data restored
```

---

## API Endpoints ✓

### Search API
```
GET /api/search/songs
Query: mood (required), genre, artist, languages, pageToken
Response: { items, nextPageToken, total }
Latency: <2s expected
```

### Mood Detection API
```
POST /api/mood/detect-webcam
Body: FormData with image
Response: { mood: "Happy" | "Sad" | "Calm" | ... }
Latency: 3-10s (depends on model)
```

### Other APIs
```
GET /api/youtube/search - YouTube search
GET /api/artists - Artist search
GET /api/text - Text-based features
```

---

## Pre-Testing Verification

### Step 1: Start Backend
```bash
cd backend
npm run dev
# Expected: "Server running on 5000"
```

### Step 2: Start Frontend
```bash
cd frontend
npm start
# Expected: "Compiled successfully" + localhost:3000 opens
```

### Step 3: Login
- Navigate to Login page
- Use test account credentials
- Set all 3 languages in Profile

### Step 4: Quick API Test
Open browser DevTools Console and run:
```javascript
// Test search API
fetch('http://localhost:5000/api/search/songs?mood=Happy&genre=Pop&languages=en')
  .then(r => r.json())
  .then(d => console.log('✓ Search API works:', d.items.length, 'songs'))
  .catch(e => console.error('✗ Search API failed:', e))
```

Expected output: `✓ Search API works: 20 songs`

---

## Common Issues & Fixes

### Backend won't start
```
Error: Cannot find module
Fix: cd backend && npm install
```

### Frontend build fails
```
Error: PORT 3000 in use
Fix: Kill process or use PORT=3001 npm start
```

### Songs not loading
```
Check: 
  1. YouTube API key in .env valid
  2. Backend running on 5000
  3. Network tab shows /api/search/songs response
  4. Mood parameter passed correctly
```

### Facial detection not working
```
Check:
  1. Webcam permission granted
  2. Good lighting
  3. HF_API_KEY valid in .env
  4. Face clearly visible
```

### Firestore not syncing
```
Check:
  1. User authenticated (auth.currentUser exists)
  2. Firebase initialized
  3. Firestore rules allow user writes
  4. Check browser console for errors
```

---

## Test Account Credentials

Use these for testing:
- **Email**: test@moodify.com (or create your own)
- **Password**: Test@123
- **Languages**: English, Spanish, French (set in Profile)

---

## Success Criteria

✅ All 12 Phases completed
✅ All 10 E2E test scenarios pass
✅ No console errors
✅ Responsive on mobile/tablet/desktop
✅ Firestore data persists across sessions
✅ API latency <2s for song search
✅ HF emotion detection works (with proper lighting)
✅ AudioPlayer fully functional
✅ No security warnings

---

## Ready to Test? 🚀

Once you verify all checkboxes above, proceed to **E2E_TESTING_GUIDE.md**

---

**Last Updated**: December 7, 2025
**All Implementations**: COMPLETE
**Status**: READY FOR TESTING
