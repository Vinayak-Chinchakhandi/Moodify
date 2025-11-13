import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const loggedIn = localStorage.getItem("moodifyLoggedIn") === "true";
console.log("🛡 ProtectedRoute running, user=", user);
console.log("🛡 localStorage:", localStorage.getItem("moodifyLoggedIn"));
  // ⏳ Firebase still restoring session
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white text-xl">
        Loading...
      </div>
    );
  }

  // ❌ Block manual URL access
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  // ❌ If Firebase says no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ✅ All checks passed
  return children;
};

export default ProtectedRoute;