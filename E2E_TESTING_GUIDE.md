# Moodify - End-to-End Testing Guide

## Prerequisites

✅ Backend running: `npm run dev` in `backend/` folder
✅ Frontend running: `npm start` in `frontend/` folder
✅ Logged in with valid Firebase user
✅ YouTube API key in `backend/.env`
✅ HF API key in `backend/.env`
✅ User languages set in profile (Language1, Language2, Language3)

---

## Test Scenario 1: ChatMood → Recommendations → Favorites/Playlist

**Objective**: Verify quiz-based mood detection flow works end-to-end

### Steps:
1. Login to Moodify
2. Click **"Chat Mood 💬"** (questionnaire)
3. Answer 4 questions with mood-based options
   - Q1: Happy options → Should recommend upbeat songs
   - Q2: Sad options → Should recommend melancholic songs
   - Q3: Calm options → Should recommend peaceful songs
   - Q4: Energetic options → Should recommend high-energy songs
4. Click **"Get Recommendations"** button
5. **Expected**: Redirected to Recommendations page with 20 songs in a dynamic grid

### Verification:
- ✓ Songs display in responsive grid (1-4 columns)
- ✓ Each song shows: thumbnail, title, artist, 3 buttons (Like, Playlist, Play)
- ✓ Fixed footer at bottom with AudioPlayer + Back + Find More buttons
- ✓ AudioPlayer shows current song title/artist
- ✓ Like button toggles (❤️ vs 🤍) and syncs to Firestore
- ✓ Playlist button opens modal with existing playlists or create new
- ✓ Play button records song to history in Firestore
- ✓ Find More button fetches next page and appends to grid
- ✓ Back button returns to ChatMood page

### Expected Song Count: 20 + pagination

---

## Test Scenario 2: ManualSelection → Recommendations → Stream

**Objective**: Verify manual selection flow and fullscreen streaming

### Steps:
1. Login to Moodify
2. Click **"Manual Selection 🎵"**
3. Select:
   - Mood: **"Happy"**
   - Genre: **"Pop"** (or any)
   - Artist: **"Taylor Swift"** (or any)
4. Click **"Recommend Songs"**
5. **Expected**: Redirected to Recommendations page with 20 songs

### Verification:
- ✓ Songs loaded successfully with your mood/genre/artist combo
- ✓ Click any song **thumbnail** → Opens fullscreen Stream page
  - ✓ YouTube video plays fullscreen
  - ✓ Back button (top-left) returns to Recommendations
  - ✓ Song info visible at bottom (title + artist)
- ✓ Like button works and persists to Firestore
- ✓ Playlist modal functional
- ✓ AudioPlayer displays song info correctly

### Expected Song Count: 20 + pagination

---

## Test Scenario 3: MoodDetection → Recommendations → Full Workflow

**Objective**: Verify facial emotion detection and complete workflow

### Steps:
1. Login to Moodify
2. Click **"Mood Detection 🎭"** (webcam)
3. **Allow webcam access** when prompted
4. Make facial expressions:
   - **Smile** → Should detect "Happy"
   - **Neutral face** → Should detect "Neutral"
   - **Sad face** → Should detect "Sad"
5. Wait for detection (3-5 seconds)
6. Once mood detected, click **"Recommend Songs 🎶"**
7. **Expected**: Redirected to Recommendations with songs for detected mood

### Verification:
- ✓ Webcam loads and displays live feed
- ✓ Mood detects within 5 seconds
- ✓ Detected mood displayed (Happy/Sad/Calm/Energetic/Romantic/Neutral)
- ✓ Retake button works (resets and shows webcam again)
- ✓ Songs load after clicking Recommend Songs
- ✓ All Recommendations features work (Like, Playlist, Play, Stream, Find More)

### Expected Song Count: 20 + pagination

**Note**: Facial detection may require good lighting and clear face visibility.

---

## Test Scenario 4: Favorites Persistence

**Objective**: Verify favorites sync across sessions

### Steps:
1. In Recommendations page, click **Like (❤️)** on 5 songs
2. Verify they appear as ❤️ (filled heart)
3. **Logout** from the app
4. **Login** again
5. Navigate to **"Favorites ⭐"** page
6. **Expected**: All 5 liked songs appear in Favorites grid

### Verification:
- ✓ Like toggle works immediately
- ✓ Firestore stores favorites under `users/{uid}/favorites`
- ✓ Favorites persist after logout/login
- ✓ Favorites page displays all liked songs
- ✓ Can unlike from Favorites page
- ✓ Unlike removes song from Firestore

---

## Test Scenario 5: Playlist Creation & Management

**Objective**: Verify playlist CRUD operations

### Steps:
1. In Recommendations page, click **Playlist (+)** on a song
2. Modal appears with existing playlists
3. Click **"Create Playlist"**
4. Enter name: **"Workout Vibes"**
5. Click **"Create Playlist"** button
6. Modal closes
7. Click **Playlist (+)** again, select **"Workout Vibes"**
8. Add 5-10 songs to playlist
9. Navigate to **"Playlists 📀"** page
10. **Expected**: "Workout Vibes" appears with all 10 songs

### Verification:
- ✓ Playlist modal opens and closes properly
- ✓ Create Playlist works and persists to Firestore
- ✓ Songs added to playlist sync immediately
- ✓ Playlists page shows playlist with correct song count
- ✓ Can add multiple songs (deduplication works)
- ✓ Can delete playlist

---

## Test Scenario 6: History Recording

**Objective**: Verify play history tracking

### Steps:
1. In Recommendations page, play (click Play button) 5 songs
2. Play audio for 5-10 seconds each (or just click Play button)
3. Navigate to **"History 📱"** page
4. **Expected**: All 5 songs appear in history (most recent first)

### Verification:
- ✓ Clicking Play button records to Firestore
- ✓ History shows songs in reverse chronological order
- ✓ History persists across sessions
- ✓ Maximum 100 plays stored (excess oldest removed)
- ✓ Can clear history

---

## Test Scenario 7: AudioPlayer Controls

**Objective**: Verify all AudioPlayer functionality

### Steps:
1. In Recommendations, ensure AudioPlayer has songs
2. Test controls:
   - Click **Play** → Audio should play
   - Click **Pause** → Audio should pause
   - Click **Next** → Song should skip to next
   - Click **Previous** → Song should go to previous
   - Click **Loop** → Should toggle "Loop On/Off"
   - Click **Like** → Heart toggles ❤️/🤍
   - Click **Playlist** → Modal opens

### Verification:
- ✓ All playback controls work
- ✓ Progress bar updates as song plays
- ✓ Time display shows current/total duration
- ✓ Like button syncs to Firestore (Favorites)
- ✓ Playlist button opens modal
- ✓ Loop toggle works

---

## Test Scenario 8: Responsive Design

**Objective**: Verify mobile/tablet/desktop layouts

### Steps:
1. Open DevTools (F12)
2. Set viewport to:
   - **Mobile**: 375x667
   - **Tablet**: 768x1024
   - **Desktop**: 1920x1080
3. Test on each:
   - Navigation menus collapse/expand
   - Song grid adjusts columns (1 mobile, 2 tablet, 4 desktop)
   - AudioPlayer buttons remain clickable
   - No text overflow or cut-off
   - Fixed footer doesn't overlap content

### Verification:
- ✓ Grid: 1 column on mobile
- ✓ Grid: 2 columns on tablet
- ✓ Grid: 3-4 columns on desktop
- ✓ All buttons accessible on mobile
- ✓ No horizontal scroll needed

---

## Test Scenario 9: Error Handling

**Objective**: Verify graceful error handling

### Steps:
1. **Network error simulation**:
   - Open DevTools → Network tab
   - Set throttling to "Offline"
   - Try to fetch recommendations
   - Expected: Error message or retry option

2. **Invalid input**:
   - Try to access Recommendations without selecting mood
   - Expected: Redirect to Home or show error

3. **Empty results**:
   - Select mood + very specific artist that returns no results
   - Expected: "No songs found" message + option to search again

### Verification:
- ✓ Error messages user-friendly
- ✓ Retry buttons functional
- ✓ No blank screens or crashes
- ✓ Loading states visible

---

## Test Scenario 10: Full Workflow Integration

**Objective**: Complete journey from login → recommendations → streaming

### Steps:
1. **Login** → Profile page
2. Set all 3 languages in profile
3. **ChatMood** → Answer quiz → Get recommendations
4. Like 3 songs
5. Add 5 songs to new playlist "Favorites Mix"
6. Click **Play** on a song (records to history)
7. Click **thumbnail** to Stream fullscreen
8. Back to Recommendations
9. **Find More** to load next 20 songs
10. Logout
11. Login again
12. Check **Favorites** → Should see 3 songs
13. Check **Playlists** → Should see "Favorites Mix" with 5 songs
14. Check **History** → Should see 1 play

### Verification:
- ✓ Full workflow completes without errors
- ✓ All data persists across sessions
- ✓ Navigation smooth and responsive
- ✓ No API rate limiting issues (20-40 calls should be fine)

---

## Performance Metrics

| Metric | Target | Tool |
|--------|--------|------|
| Song fetch latency | < 2s | DevTools Network tab |
| Grid render | < 500ms | React Profiler |
| Firestore write | < 1s | Console logs |
| AudioPlayer responsiveness | < 100ms | Manual click test |

---

## Debugging Tips

### If songs don't load:
- Check backend console for errors
- Verify YouTube API key in `.env`
- Check network tab for `/api/search/songs` response
- Verify mood parameter passed correctly

### If Firestore doesn't sync:
- Check user is authenticated (`auth.currentUser` exists)
- Verify Firestore is initialized in `firebase/firebase.js`
- Check Firestore database for `users/{uid}` collection
- Look for errors in browser console

### If HF API fails:
- Verify `HF_API_KEY` in backend `.env`
- Check HF API quota and rate limits
- Try with different emotion (smile = happy, neutral face = neutral)
- Check backend console for HF API response

### If AudioPlayer doesn't play:
- Verify song has valid `src` URL
- Check browser console for CORS errors
- Verify YouTube URLs are accessible
- Check if audio format is supported

---

## Sign-Off

Once all 10 scenarios pass, the application is **READY FOR DEMO** ✅

---

**Last Updated**: December 7, 2025
**Status**: All Phases Complete - Ready for Testing
