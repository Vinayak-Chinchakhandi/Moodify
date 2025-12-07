# 🔧 Fix Applied: Lazy-Load Environment Variables

## Problem
API keys showed as `undefined` even though they were in `.env` file:
```
⚠️ HF_API_KEY is not defined in .env file!
⚠️ YT_API_KEY is not defined in .env file!
```

## Root Cause
Module-level constants (`const YT_API_KEY = process.env.YT_API_KEY`) were evaluated when modules were imported, BEFORE `dotenv.config()` was called in `server.js`.

## Solution Applied
Moved API key reading from module-level to inside function calls (lazy evaluation):

### Before:
```javascript
// module-level (loaded too early)
const YT_API_KEY = process.env.YT_API_KEY;

export async function fetchYouTubeSongs(...) {
  // YT_API_KEY already evaluated as undefined
}
```

### After:
```javascript
export async function fetchYouTubeSongs(...) {
  // Read NOW, after dotenv.config() has run
  const YT_API_KEY = process.env.YT_API_KEY;
  
  if (!YT_API_KEY) {
    throw new Error("...");
  }
}
```

## Files Changed
- ✅ `backend/services/youtube.service.js` - Lazy-load YT_API_KEY
- ✅ `backend/services/huggingface.service.js` - Lazy-load HF_API_KEY
- ✅ `backend/server.js` - Removed startup warnings

## How to Test
```powershell
# Kill existing process (Ctrl+C if running)

# Restart
npm run dev
```

## Expected Result
- ✅ No more warnings about missing API keys
- ✅ YouTube search works
- ✅ Mood detection works
- ✅ Both APIs called successfully

## Verification
Once restarted, try:
1. Click "Manual Selection"
2. Select any mood + genre
3. Songs should load (no API errors)
