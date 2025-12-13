export async function detectEmotionFromBlob(blob) {
  try {
    const formData = new FormData();
    formData.append("image", blob, "webcam.jpg");

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/mood/detect-webcam`,
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    if (data?.mood) {
      return data.mood;   // "Happy", "Sad", "Calm", "Energetic"
    }

    return "Neutral";
  } catch (err) {
    console.error("Frontend emotion error:", err);
    return "Neutral";
  }
}