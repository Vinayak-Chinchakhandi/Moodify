import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import app from "./firebase";

const storage = getStorage(app);

// Upload profile picture or song cover
export const uploadFile = async (file, path) => {
  // path: "profilePics/uid.jpg" or "covers/songId.jpg"
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
