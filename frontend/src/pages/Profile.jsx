import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import { auth, db, storage } from "../firebase/firebase";
import {
  updatePassword,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  deleteUser,
  GoogleAuthProvider,
  linkWithPopup,
  updateProfile,
  unlink,
} from "firebase/auth";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { AiOutlineCamera } from "react-icons/ai";

const Profile = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [user, setUser] = useState({
    name: "",
    email: "",
    language1: "English",
    language2: "Kannada",
    language3: "Hindi",
    profilePic: "",
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);
  const [uploading, setUploading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const languageOptions = ["Kannada", "English", "Hindi", "Telugu", "Tamil", "Malayalam"];

  const [providerIds, setProviderIds] = useState([]);
  const googleProvider = new GoogleAuthProvider();

  // LOAD USER
  useEffect(() => {
    const loadUser = async () => {
      if (!auth.currentUser) return;

      const refDoc = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(refDoc);
      if (snap.exists()) {
        setUser((prev) => ({ ...prev, ...snap.data() }));
        setForm((prev) => ({ ...prev, ...snap.data() }));
      }

      const pdata = auth.currentUser.providerData || [];
      setProviderIds(pdata.map((p) => p.providerId));
    };
    loadUser();
  }, []);

  const isGoogleLinked = providerIds.includes("google.com");
  const isEmailPassword = providerIds.includes("password");

  // SAVE PROFILE
  const handleSave = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;
    const updatedData = { ...form };
    delete updatedData.email;

    try {
      await updateDoc(doc(db, "users", uid), updatedData);

      // PASSWORD HANDLING
      if (newPassword.trim() !== "") {
        if (isGoogleLinked && !isEmailPassword) {
          await reauthenticateWithPopup(auth.currentUser, googleProvider);
          await updatePassword(auth.currentUser, newPassword);
          alert("Password added for Moodify login.");
        } else if (isEmailPassword) {
          if (!currentPassword.trim()) return alert("Enter current password.");
          const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
          await reauthenticateWithCredential(auth.currentUser, cred);
          await updatePassword(auth.currentUser, newPassword);
          alert("Password updated.");
        }
      }

      setUser((prev) => ({ ...prev, ...updatedData }));
      setEditing(false);
      setCurrentPassword("");
      setNewPassword("");

      alert("Profile updated.");
    } catch (err) {
      alert(err.message);
    }
  };

  // PROFILE PIC UPLOAD
  const handleProfilePicChange = async (e) => {
    if (!e.target.files?.[0] || !auth.currentUser) return;
    const file = e.target.files[0];

    const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
    setUploading(true);

    const task = uploadBytesResumable(storageRef, file);
    task.on(
      "state_changed",
      null,
      () => setUploading(false),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        await updateDoc(doc(db, "users", auth.currentUser.uid), { profilePic: url });

        setUser((u) => ({ ...u, profilePic: url }));
        setForm((u) => ({ ...u, profilePic: url }));
        setUploading(false);
      }
    );
  };

  // LINK GOOGLE
  const handleLinkGoogle = async () => {
    try {
      const result = await linkWithPopup(auth.currentUser, googleProvider);

      // Attempt to determine the Google account email used in the popup
      const googleEmail =
        result?.additionalUserInfo?.profile?.email ||
        result?.user?.providerData?.find((p) => p.providerId === "google.com")?.email ||
        result?.user?.email;

      const currentEmail = auth.currentUser?.email;

      // If both emails exist and don't match, undo the link and inform user
      if (googleEmail && currentEmail && googleEmail.toLowerCase() !== currentEmail.toLowerCase()) {
        try {
          await unlink(auth.currentUser, "google.com");
        } catch (e) {
          // unlink may fail if the provider wasn't attached; ignore
        }

        // refresh provider list
        try {
          await auth.currentUser.reload();
          setProviderIds(auth.currentUser.providerData.map((p) => p.providerId));
        } catch (e) { }

        return alert("Account linking failed: Google account email does not match your registered email.");
      }

      // Try to read photo from result first, fallback to providerData
      const providerPhoto =
        result?.additionalUserInfo?.profile?.picture ||
        result?.user?.photoURL ||
        result?.user?.providerData?.find((p) => p.providerId === "google.com")?.photoURL;

      if (providerPhoto) {
        // update auth profile photoURL so auth.currentUser.photoURL is set
        try {
          await updateProfile(auth.currentUser, { photoURL: providerPhoto });
        } catch (e) {
          // non-fatal; continue to sync firestore/state
        }

        // persist to Firestore and local state
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          profilePic: providerPhoto,
        });

        setUser((u) => ({ ...u, profilePic: providerPhoto }));
        setForm((u) => ({ ...u, profilePic: providerPhoto }));
      }

      // Refresh provider list and state
      await auth.currentUser.reload();
      setProviderIds(auth.currentUser.providerData.map((p) => p.providerId));

      alert("Google linked successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  // DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    const c = window.confirm("Delete your account permanently?");
    if (!c) return;

    const uid = auth.currentUser.uid;

    try {
      await deleteDoc(doc(db, "users", uid)).catch(() => { });
      await deleteObject(ref(storage, `profilePics/${uid}`)).catch(() => { });
      await deleteUser(auth.currentUser);

      alert("Account deleted.");
      navigate("/signup");
    } catch (err) {
      alert(err.message);
    }
  };

  // LOGOUT CONFIRMATION
  const handleLogout = () => {
    const c = window.confirm("Are you sure you want to logout?");
    if (!c) return;

    localStorage.removeItem("moodifyLoggedIn");
    navigate("/login");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen text-white px-3 sm:px-4 py-4 sm:py-8">
        <div
          className="
  glass-card
  w-full
  max-w-3xl
  text-center
  p-4
  sm:p-6
  md:p-10
  relative
  rounded-2xl
"
        >
          {/* Top-left Save/Cancel controls (visible only while editing) */}
          {editing && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 z-50">
              <button
                onClick={() => {
                  // trigger form submit
                  if (formRef.current && typeof formRef.current.requestSubmit === "function") {
                    formRef.current.requestSubmit();
                  } else {
                    // fallback: call handleSave directly (keeps behaviour same)
                    handleSave();
                  }
                }}
                title="Save"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg hover:scale-105 transition"
              >
                ✅
              </button>

              <button
                onClick={() => {
                  setEditing(false);
                }}
                title="Cancel"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/10 text-white hover:bg-white/20 transition"
              >
                ❌
              </button>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 gradient-text">Your Profile 👤</h2>

          {/* PROFILE PIC */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6">
            <img
              src={form.profilePic || "/assets/default-avatar.png"}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-cyan-400 object-cover"
            />

            {editing && (
              <label htmlFor="pic" className="absolute bottom-0 right-0 bg-cyan-500 p-2 rounded-full cursor-pointer">
                <AiOutlineCamera size={20} />
                <input type="file" id="pic" className="hidden" onChange={handleProfilePicChange} />
              </label>
            )}
          </div>

          {/* VIEW MODE */}
          {!editing ? (
            <>
              <p className="text-gray-300 text-base sm:text-lg mb-4 break-all">Name: {user.name}</p>
              <p className="text-gray-300 text-base sm:text-lg mb-4 break-all">Email: {user.email}</p>

              <h3 className="text-lg sm:text-xl font-semibold text-cyan-300 mb-3">🎧 Language Preferences</h3>
              <p className="text-gray-300 mb-6">
                {user.language1}, {user.language2}, {user.language3}
              </p>

              {/* 2x2 GRID BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => setEditing(true)}
                  className="
  w-full
  flex items-center justify-center
  gap-2
  px-6 py-3
  rounded-full
  font-semibold
  bg-gradient-to-r
  from-cyan-500
  via-pink-500
  to-orange-400
  text-white
  shadow-[0_0_20px_rgba(255,0,255,0.3)]
  hover:scale-105
  transition-all
  "
                >
                  ✏️ Edit Profile
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="
  w-full
  flex items-center justify-center
  gap-2
  px-6 py-3
  rounded-full
  font-semibold
  bg-gradient-to-r
  from-red-600
  to-orange-500
  text-white
  shadow-[0_0_20px_rgba(255,80,80,0.3)]
  hover:scale-105
  transition-all
  "
                >
                  🗑 Delete Account
                </button>

                <button
                  onClick={handleLogout}
                  className="
  w-full
  flex items-center justify-center
  gap-2
  px-6 py-3
  rounded-full
  font-semibold
  bg-white/10
  border border-white/20
  backdrop-blur-xl
  text-gray-300
  hover:bg-white/20
  hover:text-orange-400
  hover:scale-105
  transition-all
  "
                >
                  🚪 Logout
                </button>

                <Link
                  to="/home"
                  className="
  w-full
  flex items-center justify-center
  gap-2
  px-6 py-3
  rounded-full
  font-semibold
  bg-white/10
  border border-white/20
  backdrop-blur-xl
  text-gray-300
  hover:bg-white/20
  hover:text-cyan-400
  hover:scale-105
  transition-all
  "
                >
                  ⬅ Back to Home
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* EDIT MODE */}
              <form ref={formRef} onSubmit={handleSave} className="space-y-6 mt-4">
                {/* NAME */}
                <div className="rounded-lg p-[2px] bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full px-3 sm:px-4 py-3 rounded-lg bg-[#0a0a1a]/90 text-white placeholder-gray-300 focus:outline-none"
                  />
                </div>

                {/* EMAIL (view only) */}
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full px-3 sm:px-4 py-3 rounded-lg bg-white/10 text-gray-300 cursor-not-allowed"
                />

                {/* PASSWORD SECTION */}
                {isGoogleLinked && !isEmailPassword ? (
                  <div className="text-gray-300 text-sm bg-white/5 p-3 rounded-lg border border-white/10">
                    You are signed in with Google.
                    <br />
                    Adding a password lets you also login using email next time.
                    <div className="rounded-lg p-[2px] mt-3 bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400">
                      <input
                        type="password"
                        placeholder="Set new password for Moodify"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 sm:px-4 py-3 rounded-lg bg-[#0a0a1a]/90 text-white"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-lg p-[2px] bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400">
                      <input
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 sm:px-4 py-3 rounded-lg bg-[#0a0a1a]/90 text-white"
                      />
                    </div>

                    <div className="rounded-lg p-[2px] bg-gradient-to-r from-cyan-500 via-pink-500 to-orange-400">
                      <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 sm:px-4 py-3 rounded-lg bg-[#0a0a1a]/90 text-white"
                      />
                    </div>
                  </>
                )}

                {/* LANGUAGE DROPDOWNS */}
                <h3 className="text-xl font-semibold text-cyan-300">🎧 Language Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["language1", "language2", "language3"].map((key) => (
                    <Dropdown
                      key={key}
                      value={form[key]}
                      onChange={(val) => setForm({ ...form, [key]: val })}
                      options={languageOptions}
                    />
                  ))}
                </div>

                {/* GOOGLE LINK IN EDIT MODE */}
                {!isGoogleLinked && (
                  <div className="text-gray-300 bg-white/5 p-4 rounded-lg border border-white/10">
                    <p className="mb-3 text-sm">
                      Link Google to login using Google next time and sync your Google profile picture.
                    </p>

                    <button
                      type="button"
                      onClick={handleLinkGoogle}
                      className="
w-full
sm:w-auto
px-6
py-3
rounded-full
bg-white/10
border border-white/20
hover:bg-white/20
transition
"
                    >
                      Link Google
                    </button>
                  </div>
                )}


              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;