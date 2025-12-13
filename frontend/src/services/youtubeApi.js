export async function fetchMoodSongs(mood, pageToken = "") {
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/youtube/songs?mood=${mood}&pageToken=${pageToken}`;
  const res = await fetch(url);
  return await res.json();
}