# 🎵 MOODIFY – Mood Based Music Recommendation Web App with Playback

Moodify is an intelligent music recommendation web application that suggests songs based on a user’s mood, preferences, and interaction style.  
It combines AI mood detection, chat-based interaction, manual selection, and real-time streaming to deliver a personalized music experience.

---

## 🚀 Key Features

### 🎭 Mood Detection (Multiple Modes)

- Chat-based Mood Detection (Conversational UI)
- Manual Mood Selection
- AI Emotion Detection using Hugging Face models
- Supports dynamic mood mapping to music genres

---

## 🎧 Music Recommendation System

- Mood-based song recommendations  
- Language-aware suggestions (based on user profile)  
- Artist-based and manual search  
- YouTube-powered streaming  
- iTunes-based metadata search  

---

## ▶️ Smart Audio & Video Playback

- Global persistent audio player  
- Background audio continues across pages  
- Stream full video in a dedicated Stream page  
- Smooth transition between audio ↔ video playback  
- Next / Previous controls work across playlists, favorites, and history  

---

## ❤️ User Personalization

- Firebase Authentication (Email & Google login)
- User profile with:
  - Profile picture
  - Preferred languages
- Favorites, History, and Playlists
- Persistent listening state across navigation

---

## 🔐 Secure & Scalable

- Firebase Authentication & Storage
- Firestore for user data
- Express backend with modular architecture
- Environment variable protection

---

## 🏗️ Project Architecture

### 📁 Folder Structure (Simplified)
```bash
MOODIFY/
│
├── backend/          # Node.js + Express backend
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── middlewares/
│   ├── utils/
│   ├── server.js
│   └── .env
│
├── frontend/         # React + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── firebase/
│   │   ├── utils/
│   │   └── App.js
│   └── .env
│
├── package.json      # Root scripts
└── README.md
```

---

## 🧠 Tech Stack

### Frontend

- React.js
- Tailwind CSS
- React Router
- Firebase SDK
- YouTube IFrame Embed

### Backend

- Node.js
- Express.js
- Axios
- YouTube Data API
- iTunes Search API
- Hugging Face Inference API

### Database & Authentication

- Firebase Authentication
- Firestore Database
- Firebase Storage

---

## 🔄 Application Workflow

1. User logs in using Email or Google Authentication

2. User selects mood via:
- Chat-based interaction
- Manual mood selection
- AI mood detection

3. Backend fetches songs using mood-based keywords

4. Recommendations are displayed to the user

5. Audio starts playing in the global background player

6. User can:
- Add songs to favorites
- Add songs to playlists
- View listening history

7. Clicking Stream opens full video playback

8. Returning from stream resumes background audio playback
