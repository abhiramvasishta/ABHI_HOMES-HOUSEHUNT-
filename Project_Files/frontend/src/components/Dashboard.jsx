import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FiLogOut, FiHome, FiCamera } from "react-icons/fi";

const apiBaseUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(`${apiBaseUrl}/user/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.warn("Logout failed or already logged out:", error);
    } finally {
      localStorage.clear();
      setUser(null);
      navigate("/login", { replace: true });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newAvatar = reader.result;
      const updatedUser = { ...user, avatar: newAvatar };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("avatar", newAvatar);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const avatarSrc = user?.avatar || "/avatars/avatar1.jpg";

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br to-gray-900 overflow-hidden">
      {/* Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-md text-center border border-white/20 relative z-10"
      >
        {user ? (
          <>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-white shadow-lg mb-4"
            >
              <img
                src={avatarSrc}
                alt={user.name}
                className="object-cover w-full h-full"
              />
              <button
                onClick={triggerFileSelect}
                className="absolute bottom-0 right-0 bg-black/60 p-1 rounded-full text-white hover:bg-black/80"
                title="Change Avatar"
              >
                <FiCamera />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </motion.div>

            <motion.h2
              className="text-3xl font-extrabold text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome, {user.name}!
            </motion.h2>

            <p className="text-gray-300 text-sm mt-1">{user.email}</p>

            <div className="flex flex-col gap-4 mt-6">
              <Link
                to="/userhomes"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md"
              >
                <FiHome /> Your Connected Homes
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          </>
        ) : (
          <p className="text-xl text-white">Please log in to view your dashboard.</p>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
