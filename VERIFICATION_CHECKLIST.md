# Moodify Test Verification Checklist

## 🔍 Pre-Testing Verification

### Backend Setup ✓

- [x] `backend/.env` contains:
  - `HF_API_KEY=hf_...` ✅
  - `YT_API_KEY=AIza...` ✅
  - `PORT=5000` ✅

- [x] Backend server runs:
  ```bash
  cd backend && npm run dev
  ```
  Expected: "Server running on 5000" ✅

- [x] Routes registered in `server.js`:
  - `/api/search` → search.routes.js ✅
  - `/api/mood` → mood.routes.js ✅
  - `/api/youtube` → youtube.routes.js ✅

- [x] Controllers implemented:
  - `search.controller.js` - searchSongs(), getMoreSongs() ✅
  - `mood.controller.js` - detectWebcamMood() ✅
  - `youtube.controller.js` - existing ✅

- [x] Services implemented:
  - `huggingface.service.js` - detectEmotionFromBuffer() ✅
  - `youtube.service.js` - existing ✅
  - `moodKeywords.js` - fetchMoodKeywords() ✅

---

### Frontend Setup ✓

- [x] `frontend/.env` contains:
  - `REACT_APP_BACKEND_URL=http://localhost:5000` (if needed)

- [x] Frontend runs:
  ```bash
  cd frontend && npm start
  ```
  Expected: "Compiled successfully!" ✅

- [x] All pages exist in `frontend/src/pages/`:
  - ChatMood.jsx ✅
  - ManualSelection.jsx ✅
  - MoodDetection.jsx ✅
  - Recommendations.jsx ✅ (REBUILT)
  - Stream.jsx ✅ (NEW)
  - Favorites.jsx ✅
  - Playlists.jsx ✅
  - History.jsx ✅

- [x] Components implemented:
  - AudioPlayer.jsx - ENHANCED with Like/Playlist ✅
  - WebcamCapture.jsx ✅
  - SongCard.jsx ✅
  - Others - existing ✅

- [x] Services created:
  - `firestoreService.js` - Favorites, Playlists, History CRUD ✅
  - `hfEmotionDetector.js` - detectEmotionFromBlob() ✅

- [x] Routes in `App.js`:
  - `/chat-mood` → ChatMood ✅
  - `/manual-selection` → ManualSelection ✅
  - `/mood-detection` → MoodDetection ✅
  - `/recommendations` → Recommendations ✅
  - `/stream` → Stream ✅
  - `/favorites` → Favorites ✅
  - `/playlists` → Playlists ✅
  - `/history` → History ✅

---

### Firebase Setup ✓

- [x] Firebase configured:
  - `frontend/src/firebase/firebase.js` initialized ✅
  - Auth working (Google OAuth + Email/Password) ✅
  - Firestore accessible ✅

- [x] Firestore collections ready:
  - `users/{uid}/favorites` ✅
  - `users/{uid}/playlists` ✅
  - `users/{uid}/history` ✅

- [x] User profile fields:
  - email ✅
  - displayName ✅
  - photoURL ✅
  - language1, language2, language3 ✅

---

## 🧪 Functionality Verification

### Test 1: Backend API Health

Run in browser console:
```javascript
// Test search endpoint
fetch('http://localhost:5000/api/search/songs?mood=Happy&genre=Pop&languages=en')
  .then(r => r.json())
  .then(d => console.log('✓ Search API works:', d.items?.length || 0, 'songs'))
  .catch(e => console.error('✗ Search API error:', e.message))
```

Expected: `✓ Search API works: 20 songs`

---

### Test 2: Frontend Page Load

1. Navigate to http://localhost:3000
2. Verify **no console errors** (F12 → Console)
3. Verify **all pages load** without 404s
4. Expected: Homepage loads with navigation options

---

### Test 3: Authentication

1. Click **Login**
2. Use Google OAuth or email/password
3. Verify redirected to **Profile** page
4. Set languages in Profile
5. Expected: User logged in, profile saved

---

### Test 4: ChatMood Flow (Critical)

1. Click **Chat Mood 💬**
2. See 4 questions with mood options
3. Click options to answer all 4
4. Click **"Get Recommendations"**
5. Wait for API response
6. Expected: 20 songs load in grid

**Pass?** ✅ / ❌

---

### Test 5: ManualSelection Flow (Critical)

1. Click **Manual Selection 🎵**
2. Select Mood: **Happy**
3. Select Genre: **Pop**
4. Artist: (leave blank)
5. Click **"Recommend Songs"**
6. Expected: 20 songs load related to Happy/Pop

**Pass?** ✅ / ❌

---

### Test 6: MoodDetection Flow (Important)

1. Click **Mood Detection 🎭**
2. Allow webcam
3. Show different emotions to camera
4. Wait 3-5 seconds for detection
5. Expected: Mood detected (Happy/Sad/Calm/etc)
6. Click **"Recommend Songs"**
7. Expected: 20 songs load

**Pass?** ✅ / ❌

**Note**: If webcam fails, this is NOT critical for MVP

---

### Test 7: AudioPlayer Controls

In Recommendations page:
- [ ] Play button works (song plays)
- [ ] Pause button works
- [ ] Next button skips song
- [ ] Previous button goes back
- [ ] Loop button toggles
- [ ] Progress bar seekable
- [ ] Like button toggles ❤️/🤍
- [ ] Playlist button opens modal

**Pass?** ✅ / ❌

---

### Test 8: Favorites/Like Functionality

1. In Recommendations, click **Like (❤️)** on 3 songs
2. Heart should fill with pink
3. Navigate to **Favorites ⭐**
4. Expected: All 3 liked songs appear
5. Logout and login again
6. Expected: Favorites still there

**Pass?** ✅ / ❌

---

### Test 9: Playlist Creation

1. In Recommendations, click **Playlist (+)**
2. Modal shows, click **"Create Playlist"**
3. Enter: **"Test Playlist"**
4. Click **"Create Playlist"** button
5. Modal closes
6. Click **Playlist (+)** again
7. Select **"Test Playlist"** and add song
8. Navigate to **Playlists 📀**
9. Expected: "Test Playlist" shows with 1+ song

**Pass?** ✅ / ❌

---

### Test 10: Stream/YouTube

1. In Recommendations, click **song thumbnail**
2. Expected: Fullscreen YouTube embed opens
3. Video should autoplay
4. Click **Back** button
5. Expected: Return to Recommendations

**Pass?** ✅ / ❌

---

### Test 11: History Recording

1. In Recommendations, click **Play** on 5 songs
2. Navigate to **History 📱**
3. Expected: All 5 songs in history (most recent first)
4. Logout and login
5. Expected: History persists

**Pass?** ✅ / ❌

---

### Test 12: Pagination

1. In Recommendations page
2. Scroll to bottom
3. Click **Find More** button
4. Expected: Next 20 songs append to grid
5. Total should be 40+ songs

**Pass?** ✅ / ❌

---

## 📱 Responsive Design Check

Open DevTools (F12) and test each viewport:

### Mobile (375x667)
- [ ] Grid shows 1 column
- [ ] Buttons clickable
- [ ] No horizontal scroll
- [ ] Footer visible
- [ ] Navigation accessible

### Tablet (768x1024)
- [ ] Grid shows 2 columns
- [ ] Layout comfortable
- [ ] All controls visible
- [ ] Responsive images

### Desktop (1920x1080)
- [ ] Grid shows 3-4 columns
- [ ] Optimal spacing
- [ ] All features accessible
- [ ] No wasted space

---

## 🚨 Common Failures & Fixes

### Songs don't load
```
Symptom: /api/search/songs returns error or empty
Fix:
  1. Check backend console for error details
  2. Verify YT_API_KEY is valid in backend/.env
  3. Check YouTube API quota in Google Cloud
  4. Ensure mood parameter is sent
```

### Like button doesn't work
```
Symptom: Heart doesn't fill, no error message
Fix:
  1. Verify user is logged in (auth.currentUser exists)
  2. Check Firestore initialized correctly
  3. Open DevTools → Firestore to see if write attempted
  4. Check browser console for errors
```

### Webcam won't start
```
Symptom: WebcamCapture shows black/blocked
Fix:
  1. Allow camera permission when prompted
  2. Check if another app using camera
  3. Try in Incognito mode
  4. Ensure good lighting for detection
```

### Stream page blank
```
Symptom: No YouTube video visible
Fix:
  1. Verify song has valid videoId
  2. Check YouTube video is public
  3. Try different song
  4. Check browser console for iframe errors
```

### Firestore not persisting
```
Symptom: Favorites/Playlists lost after logout
Fix:
  1. Verify Firebase init in frontend/src/firebase/firebase.js
  2. Check user UID matches auth.currentUser.uid
  3. View Firestore Console to see if doc created
  4. Check Firestore Rules aren't blocking writes
```

---

## ✅ Final Verification

After all tests pass, verify:

- [ ] No console errors (F12 → Console clean)
- [ ] No 404s in Network tab
- [ ] All Firestore reads/writes <1s
- [ ] Search API responds <2s
- [ ] UI responsive on all screen sizes
- [ ] All 3 entry flows work end-to-end
- [ ] Data persists across logout/login
- [ ] AudioPlayer fully functional

---

## 🎯 Success Criteria

### MINIMUM (MVP)
- [ ] ChatMood → Recommendations → Songs load
- [ ] ManualSelection → Recommendations → Songs load
- [ ] Like button toggles
- [ ] Favorites page shows liked songs
- [ ] No console errors

### EXPECTED
- [ ] All of above
- [ ] MoodDetection works
- [ ] Playlists creation works
- [ ] Stream page works
- [ ] History persists
- [ ] Responsive on mobile

### ADVANCED
- [ ] All of above
- [ ] AudioPlayer all controls work
- [ ] Pagination (Find More) works
- [ ] Performance metrics met
- [ ] Edge cases handled

---

## 🏁 Ready to Test?

If all items above are checked ✅, you're ready!

**Start with**: `QUICK_START.md` (5 minutes)

---

**Last Updated**: December 7, 2025
**Verification Status**: All Phases Ready
**Recommendation**: Begin Testing! 🚀
