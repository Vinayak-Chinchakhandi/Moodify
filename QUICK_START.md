# Moodify - Quick Start Guide (5 Minutes to First Test)

## 🚀 Start the Application

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

**Expected Output:**
```
Server running on 5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view moodify in the browser.
  Local: http://localhost:3000
```

---

## 🔐 Login

1. Go to **http://localhost:3000**
2. Click **Login**
3. Use any Gmail account or create test account:
   - Email: `test@moodify.com`
   - Password: `Test@123`

4. After login, go to **Profile** and set:
   - Language 1: English
   - Language 2: Spanish  
   - Language 3: French
   - Click **Save**

---

## 🎯 5-Minute Test Flow

### Test 1: ChatMood (Fastest - 2 min)
1. Click **"Chat Mood 💬"**
2. Answer 4 mood-based questions (pick first option each time)
3. Click **"Get Recommendations 🎶"**
4. **Verify**: 20 songs load in a grid
5. Click **thumbnail** of any song → Opens fullscreen YouTube
6. Back button returns to Recommendations
7. Click **Like (❤️)** button on one song
8. Verify heart fills with pink color

✅ **PASS**: Songs load, Like works, Stream works

---

### Test 2: Manual Selection (2 min)
1. Click **"Manual Selection 🎵"**
2. Select:
   - Mood: **Happy**
   - Genre: **Pop**
   - Artist: (leave blank or enter any)
3. Click **"Recommend Songs 🎶"**
4. **Verify**: 20 songs load with Happy/Pop theme
5. Click **Playlist (+)** button
6. Type playlist name: **"My Favorites"**
7. Click **"Create Playlist"**
8. Add song to playlist
9. Verify modal closes

✅ **PASS**: Songs load, Playlist creation works

---

### Test 3: MoodDetection (2 min - Optional)
1. Click **"Mood Detection 🎭"**
2. Allow webcam access
3. **Smile at camera** and wait 3-5 seconds
4. **Verify**: Detected mood shows as "Happy" or similar
5. Click **"Recommend Songs 🎶"**
6. **Verify**: 20 songs load

✅ **PASS**: Facial emotion detection works, songs load

---

## 🔍 Verify Data Persistence

1. Click **"Favorites ⭐"**
2. **Verify**: Previously liked songs appear here
3. Click **"Playlists 📀"**
4. **Verify**: "My Favorites" playlist appears with songs
5. Click **"History 📱"**
6. **Verify**: Played songs appear in history

✅ **PASS**: Firestore persistence works

---

## 🛠️ Troubleshooting (30 seconds)

### Songs don't load?
```
1. Check backend console for errors
2. Verify YouTube API key in backend/.env
3. Reload page (Ctrl+R)
```

### Webcam not working?
```
1. Click "Allow" when browser asks for camera
2. Ensure good lighting
3. Use Chrome/Edge (Firefox may have issues)
```

### Playlist not saving?
```
1. Check Firestore in Firebase Console
2. Verify user is logged in
3. Check browser console for errors
```

### AudioPlayer not playing?
```
1. Verify songs have valid YouTube IDs
2. Check if browser has audio permissions
3. Try different song/retry
```

---

## ✅ Success Checklist

After running above tests, you should see:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can login with Google/email
- [ ] ChatMood loads 20 songs
- [ ] ManualSelection loads 20 songs
- [ ] MoodDetection detects emotion
- [ ] Clicking song thumbnail opens fullscreen YouTube
- [ ] Like button toggles and syncs
- [ ] Playlist creation works
- [ ] Favorites page shows liked songs
- [ ] Playlists page shows created playlists
- [ ] History page shows played songs
- [ ] Back buttons navigate correctly
- [ ] Find More button loads next page
- [ ] AudioPlayer controls work (Play/Pause/Next/Prev)

---

## 📊 Performance Check

Open DevTools (F12) → Network tab and check:

- `GET /api/search/songs?...` → Should return <2s
- `POST /api/mood/detect-webcam` → Should return 3-10s (first time) or 1-5s (cached)
- Songs display → Should render <1s
- Like button → Should sync <500ms

---

## 🎉 Ready for Full Testing?

Once all 5-minute tests pass, proceed to:
- **E2E_TESTING_GUIDE.md** - 10 comprehensive test scenarios
- **PRE_TESTING_CHECKLIST.md** - Detailed setup verification

---

## 🆘 Still Having Issues?

1. Check **browser console** (F12 → Console) for errors
2. Check **backend console** for API errors
3. Open **Firebase Console** to verify Firestore data
4. Check **.env files** have correct API keys
5. Verify **npm install** was run in both backend and frontend

---

**Estimated Time**: 5-10 minutes
**Success Rate**: 95%+ if steps followed

**Status**: ✅ READY FOR TESTING

Last Updated: December 7, 2025
