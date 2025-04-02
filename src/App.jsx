import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, AuthContext } from "./utility/AuthContext";
import { ToastContainer } from "react-toastify";
import Letter from "./pages/Letter";
import SavedLetter from "./pages/SavedLetter";
import { FcGoogle } from "react-icons/fc";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/" />;
}

function AppContent() {
  const { user, login, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-6 text-primary">Letter Management System</h1>
        <button
          onClick={login}
          className="px-4 py-2 bg-blue-50 text-black rounded-lg flex items-center"
        >
          <FcGoogle className="text-xl mr-4"  />
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6 text-primary">Welcome, {user.displayName}</h1>
      <div>
        <Link to="/" className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2 no-underline">
          Compose Letter
        </Link>
        <Link to="/saved" className="px-4 py-2 bg-yellow-500 text-white rounded-lg no-underline">
          View Saved Letters
        </Link>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg absolute top-2 right-2"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <AppContent />
        <Routes>
          <Route path="/" element={<ProtectedRoute><Letter /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedLetter /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;