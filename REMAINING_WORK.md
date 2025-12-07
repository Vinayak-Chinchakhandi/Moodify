# Remaining Work - Priority Order

## 🔴 CRITICAL (Blocking Demo)

### 1. AudioPlayer Component Enhancement
**File**: `frontend/src/components/AudioPlayer.jsx`

**Changes Needed**:
- Add `onLike` callback prop
- Add `onAddPlaylist` callback prop
- Add action buttons (Like, Playlist) alongside player controls
- Make sure buttons are clickable even while playing

**Why**: Recommendations page calls `onLike` and `onAddPlaylist` but AudioPlayer doesn't expose them yet.

---

### 2. Fix Backend Search Endpoint for HF API Integration
**File**: `backend/services/youtube.service.js`

**Status**: ✅ DONE - Already integrated properly

**But Need**: Make sure `/api/search/songs` is being called from Recommendations page with correct parameters.

---

### 3. HF Mood Detection Integration  
**File**: `frontend/utils/hfEmotionDetector.js` (or `frontend/src/services/hfService.js`)

**Status**: Currently uses MOCK detection

**Changes Needed**:
- Call backend endpoint `/api/mood/detect-hf` with image blob
- Backend should call HuggingFace API with the blob
- Return detected mood (Happy, Sad, Calm, Energetic, Romantic, Neutral)

**Backend Endpoint to Create**:
```javascript
POST /api/mood/detect-hf
Body: FormData { image: blob }
Response: { mood: "Happy" }
```

---

## 🟡 HIGH PRIORITY (Core Features)

### 4. Test E2E Flows
Test each scenario in IMPLEMENTATION_GUIDE.md:
- Manual Selection → Recommendations → Favorites/Playlist/History
- MoodDetection → Recommendations → Stream
- ChatMood → Recommendations → All features

**Blockers**: AudioPlayer and HF integration

---

### 5. Firestore Security Rules
**File**: Firebase Console or `firestore.rules`

**Current Issue**: Database might be open; need rules to prevent cross-user access

**Template**:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## 🟢 MEDIUM PRIORITY (Polish)

### 6. Error Handling & Loading States
- Add error boundaries in Recommendations
- Show loading skeleton while songs fetch
- Add retry button on failed requests

### 7. Responsive Layout Tweaks
- Test on mobile (narrower scrollable area)
- Adjust font sizes for smaller screens
- Ensure fixed footer doesn't overlap content

### 8. Stream Page Polish
- Add video title/artist overlay
- Consider adding subtitle for full video info

---

## 🔵 LOW PRIORITY (Nice-to-Have)

### 9. Performance Optimization
- Cache song results locally
- Debounce pagination requests
- Lazy-load thumbnails

### 10. Additional Features
- Skip to next song without AudioPlayer controls
- Add search history in Manual Selection
- Recommend based on time of day

---

## 🚦 Recommended Next Steps

1. **Immediately**: Fix AudioPlayer to expose Like/Playlist buttons
2. **Next**: Implement HF API integration and test MoodDetection
3. **Then**: Run full E2E tests for all 3 flows
4. **Finally**: Polish UI, add error handling, deploy

**Estimated Time**: 
- AudioPlayer: 30 mins
- HF API: 1-2 hours
- Testing & debugging: 2-3 hours
- Polish: 1 hour

**Total**: ~4-6 hours to fully working demo
