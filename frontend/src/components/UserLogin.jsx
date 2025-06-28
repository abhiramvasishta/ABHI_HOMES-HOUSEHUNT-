// src/components/UserLogin.jsx

import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { jwtDecode } from "jwt-decode"; // ✅ fixed import

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const apiBaseUrl = import.meta.env.VITE_API_URL;

const UserLogin = ({ setUser, setUserType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const showNotification = (name) => {
    if (Notification.permission === "granted") {
      new Notification("🎉 Login Successful!", {
        body: `Welcome back, ${name}! 🏡`,
        icon: "/homes.jpg",
        vibrate: [200, 100, 300],
        requireInteraction: true,
      });
    }
  };

  const handleLoginSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const { credential } = credentialResponse;
      const decoded = jwtDecode(credential); // ✅ updated usage

      const { data } = await axios.post(
        `${apiBaseUrl}/user/google-login`,
        { token: credential },
        { withCredentials: true }
      );

      const user = data.user;

      const formatted = {
        name: user.name || decoded.name,
        email: user.email || decoded.email,
        avatar: "/avatars/avatar1.jpg",
        mobile: user.mobile,
        id: user._id,
        role: user.role || "user",
      };

      setUser(formatted);
      setUserType(formatted.role);
      localStorage.setItem("user", JSON.stringify(formatted));
      localStorage.setItem("userId", formatted.id);
      localStorage.setItem("userRole", formatted.role);
      localStorage.setItem("avatar", formatted.avatar);

      showNotification(formatted.name);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Login failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginFailure = (err) => {
    console.error("Google auth error:", err);
    setError("Google authentication error.");
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background animation */}
        <motion.div
          className="absolute top-10 left-[-50px] w-80 h-80 bg-blue-500 rounded-full opacity-20 filter blur-3xl"
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-[-50px] w-96 h-96 bg-purple-500 rounded-full opacity-20 filter blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl max-w-sm w-full p-8 z-10 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 className="text-4xl font-extrabold text-white mb-4">
            Welcome Back!
          </motion.h1>
          <motion.p className="text-gray-200 mb-6">
            Sign in with your Google account to continue to Abhi Homes.
          </motion.p>

          {error && <div className="text-red-400 mb-4">{error}</div>}

          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
            useOneTap
          />

          <motion.div className="mt-6 text-sm text-gray-300 flex justify-center">
            <img src="home.png" alt="Home Icon" className="w-20 rounded-2xl" />
          </motion.div>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default UserLogin;
