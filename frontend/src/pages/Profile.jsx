import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Dropdown from "../components/Dropdown";
import { auth, db, storage } from "../firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { AiOutlineCamera } from "react-icons/ai";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "********",
    language1: "English",
    language2: "Kannada",
    language3: "Hindi",
    profilePic: "",
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);
  const [uploading, setUploading] = useState(false);

  const languageOptions = ["Kannada", "English", "Hindi", "Telugu", "Tamil", "Malayalam"];

  // ✅ Load user info from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      if (!auth.currentUser) return;
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser({ ...user, ...data });
        setForm({ ...user, ...data });
      }
    };
    fetchUser();
  }, []);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setForm(user);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { ...form });
      setUser(form);
      setEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Failed to update profile.");
    }
  };

  const handleLogout = () => navigate("/login");

  // ✅ Upload profile picture to Firebase Storage + Save URL to Firestore
  const handleProfilePicChange = async (e) => {
    if (!e.target.files[0] || !auth.currentUser) return;
    const file = e.target.files[0];
    const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
    setUploading(true);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      null,
      (err) => {
        console.error("Upload error:", err);
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);

        // ✅ Save photo URL to Firestore immediately
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { profilePic: url });

        // ✅ Update state instantly for immediate preview
        setForm((prev) => ({ ...prev, profilePic: url }));
        setUser((prev) => ({ ...prev, profilePic: url }));
        setUploading(false);
      }
    );
  };

  return (
    <PageWrapper>
      <div
        className={`flex flex-col items-center justify-center min-h-screen text-white px-6 py-10 transition-all duration-500 ${
          editing ? "max-w-6xl mx-auto" : "max-w-3xl mx-auto"
        }`}
      >
        <div
          className={`relative z-10 w-full ${
            editing ? "max-w-5xl" : "max-w-2xl"
          } glass-card text-center p-10 backdrop-blur-2xl border border-white/10 rounded-2xl transition-all duration-500`}
        >
          <h2 className="text-4xl font-extrabold mb-6 gradient-text">Your Profile 👤</h2>

          {/* ✅ Profile Picture + Camera Icon */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            <img
              src={form.profilePic || "/assets/default-avatar.png"}
              alt="User Avatar"
              className="w-32 h-32 rounded-full border-4 border-cyan-400 object-cover"
            />
            {editing && (
              <label
                htmlFor="profilePicInput"
                className="absolute bottom-0 right-0 bg-cyan-500 text-white p-2 rounded-full cursor-pointer hover:bg-cyan-400 transition"
                title="Change Profile Picture"
              >
                <AiOutlineCamera size={20} />
                <input
                  type="file"
                  id="profilePicInput"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </label>
            )}
            {uploading && (
              <p className="text-sm text-gray-400 mt-2 animate-pulse">Uploading...</p>
            )}
          </div>

          {/* ✅ View / Edit Sections */}
          {!editing ? (
            <div className="space-y-4 text-lg text-gray-300">
              <p>
                <span className="font-semibold text-cyan-400">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-semibold text-pink-400">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-semibold text-orange-400">Preferred Languages:</span>
              </p>
              <ul className="text-gray-400">
                <li>1️⃣ {user.language1}</li>
                <li>2️⃣ {user.language2}</li>
                <li>3️⃣ {user.language3}</li>
              </ul>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleEdit}
                  className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105 transition-transform"
                >
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-pink-600 to-red-500 hover:scale-105 transition-transform"
                >
                  🚪 Logout
                </button>
                <Link
                  to="/home"
                  className="px-6 py-3 rounded-full font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition"
                >
                  ⬅ Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSave}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300 text-left w-full transition-all duration-500"
            >
              {["name", "email", "password"].map((key) => (
                <div key={key} className="w-full rounded-lg p-[2px] bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400">
                  <input
                    type={key === "password" ? "password" : "text"}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={
                      key === "name" ? "Your Name" : key === "email" ? "Your Email" : "Your Password"
                    }
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a1a]/90 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-200"
                    required
                  />
                </div>
              ))}

              {/* 🎧 Language Preferences */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold text-cyan-300 mt-4 mb-3 text-center">
                  🎧 Language Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["language1", "language2", "language3"].map((langKey) => (
                    <Dropdown
                      key={langKey}
                      value={form[langKey]}
                      onChange={(val) => setForm({ ...form, [langKey]: val })}
                      options={languageOptions}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="md:col-span-2 flex justify-center gap-4 mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400 hover:scale-105 transition-transform shadow-[0_0_25px_rgba(255,0,255,0.3)]"
                >
                  💾 Save
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-full font-semibold bg-gray-600 hover:bg-gray-700 transition"
                >
                  ✖ Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Profile;
