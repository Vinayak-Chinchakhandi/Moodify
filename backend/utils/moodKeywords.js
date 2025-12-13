/**
 * Mood to search keywords mapping
 */
export function fetchMoodKeywords(mood) {
  const moodKeywords = {
    Happy: ["happy songs", "feel good music", "uplifting pop", "cheerful tracks", "joy music"],
    Sad: ["sad songs", "emotional music", "heartbreak songs", "melancholic", "blues music"],
    Calm: ["lofi beats", "calm music", "relaxing instrumental", "meditation", "ambient music"],
    Energetic: ["edm mix", "workout playlist", "high energy music", "dance", "electronic"],
    Romantic: ["romantic songs", "love hits", "soft romantic tracks", "slow love songs", "couples music"],
    Neutral: ["top hits mix", "popular playlist", "trending music", "viral songs"],
  };

  return moodKeywords[mood] || moodKeywords["Neutral"];
}
