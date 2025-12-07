# 🎬 How to Run Moodify RIGHT NOW

## ⚡ Fast Track (Copy & Paste)

### Step 1: Navigate to Project
```powershell
cd d:\PROJECTS\Moodify
```

### Step 2: Install Dependencies (First Time Only)
```powershell
npm install
cd backend
npm install
cd ..
cd frontend
npm install
cd ..
```

### Step 3: Start Everything
```powershell
# From project root (d:\PROJECTS\Moodify)
npm run dev
```

You should see:
```
[0] [dotenv@17.2.3] injecting env (3) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
[0] Server running on 5000
[1] Compiled successfully!
```

### Step 4: Open Browser
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

---

## 🧪 Test Right Away

### Click One of These on Home Page:

#### Test 1: Manual Selection (Fastest ⚡)
```
✅ Click "Manual Selection"
✅ Select Genre: Pop
✅ Type Artist: Taylor (auto-suggest shows)
✅ Select Mood: Happy
✅ Click "Recommend Songs"
⏱️ Should load within 2-3 seconds
👀 You should see song cards
❤️ Click heart to like
📋 Click playlist to add
```

#### Test 2: Mood Detection (Cool Demo 😎)
```
✅ Click "Mood Detection"
✅ Click "Allow" for camera
✅ Wait for mood detection (3-5 seconds)
✅ System shows detected mood
✅ Click "Recommend Songs"
👀 You should see songs for detected mood
🔄 Click "Retake" to try again
```

#### Test 3: ChatMood (Fun Interactive 🎯)
```
✅ Click "ChatMood"
✅ Answer the mood questions
✅ Submit form
👀 See aggregated mood
🎵 Get personalized songs
```

---

## ✅ Verification Checklist

Check these while running:

### Backend Console (Should Show)
```
[dotenv] injecting env (3) from .env
Server running on 5000
```

### Frontend Console (Should Show)
```
Compiled successfully!
webpack compiled successfully
```

### No Errors Should Appear
- ❌ No "YT_API_KEY=undefined"
- ❌ No "Cannot find module"
- ❌ No "ECONNREFUSED"

### API Calls Should Work
- ✅ Click song recommendation → loads
- ✅ Click favorite → no errors
- ✅ Click playlist → no errors
- ✅ Webcam detection → shows mood

---

## 🎯 Features to Test

### Workflow 1: Find Music
```
1. Go to Manual Selection
2. Pick Genre, Artist, Mood
3. See songs appear
4. Load more songs (scroll down)
```

### Workflow 2: Save Favorites
```
1. On recommendations page
2. Click ❤️ on any song
3. Go to "Favorites" in navbar
4. See your saved songs
```

### Workflow 3: Create Playlist
```
1. On recommendations page
2. Click 📋 on any song
3. Create new playlist or add to existing
4. Go to "Playlists" in navbar
5. See your playlist
```

### Workflow 4: View History
```
1. Play some songs
2. Go to "History" in navbar
3. See recently played
```

### Workflow 5: Edit Profile
```
1. Click "Profile" in navbar
2. Update name/languages
3. Click "Save"
4. Should see confirmation
```

---

## 🐛 If Something Breaks

### Backend Won't Start
```powershell
# Kill any existing processes
Get-Process node | Stop-Process -Force

# Try again
cd d:\PROJECTS\Moodify
npm run dev
```

### YouTube 400 Error
Check backend console shows:
```
YT_API_KEY=<loaded key>
HF_API_KEY=<loaded key>
```

Not "undefined"

### Can't Connect to Backend
```powershell
# Check if port 5000 is free
netstat -ano | findstr :5000

# If something is using it, kill it
taskkill /PID <PID> /F

# Restart
npm run dev
```

### Frontend Shows Blank Page
```
1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. Check browser console for errors (F12)
3. Check backend is running
```

---

## 📊 Expected Output Timeline

```
t=0s    npm run dev
        [Starting concurrently...]

t=2s    [0] [dotenv] injecting env (3) from .env
        [0] Server running on 5000
        [1] [WEBPACK] ...

t=5s    [1] Compiled successfully!
        [1] You can now view frontend in the browser
        [1] Local: http://localhost:3000

t=10s   [Ready - both running]
        Open http://localhost:3000
        Try "Manual Selection"
        Should load songs in ~3 seconds
```

---

## 🎬 Demo Video Script (If You Wanted to Show Someone)

1. **Homepage** (5 seconds)
   - "This is Moodify, a music recommendation app"
   - Click "Manual Selection"

2. **Manual Selection** (10 seconds)
   - "Pick genre, artist, mood"
   - Select Pop, Taylor Swift, Happy
   - Click "Recommend Songs"

3. **Songs Load** (5 seconds)
   - "It fetches songs from YouTube"
   - Scroll through songs
   - Show AudioPlayer at bottom

4. **Favorites** (5 seconds)
   - Click ❤️ on a song
   - Go to "Favorites"
   - "Your songs are saved in Firestore"

5. **Playlists** (5 seconds)
   - Click 📋 on song
   - Create playlist
   - Go to "Playlists"

6. **Mood Detection** (10 seconds)
   - Go to "Mood Detection"
   - Face camera
   - Shows detected mood
   - Gets recommendations for that mood

---

## 📈 Performance Expectations

| Action | Time | Status |
|--------|------|--------|
| App startup | 5-10s | ✅ Normal |
| Manual selection search | 2-3s | ✅ YouTube API |
| Mood detection | 3-5s | ✅ HF inference |
| Like song | <1s | ✅ Firestore |
| Load more songs | 2-3s | ✅ YouTube pagination |
| Profile save | 1-2s | ✅ Firestore |

---

## ✨ You're All Set!

```
cd d:\PROJECTS\Moodify
npm run dev
```

Then go to: **http://localhost:3000**

**Enjoy!** 🎵
