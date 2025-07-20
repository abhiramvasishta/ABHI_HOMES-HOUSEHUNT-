import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          if (Notification.permission === "default") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted" && !localStorage.getItem("notificationShown")) {
                sendWelcomeNotification(registration);
                localStorage.setItem("notificationShown", "true");
              }
            });
          } else if (!localStorage.getItem("notificationShown")) {
            sendWelcomeNotification(registration);
            localStorage.setItem("notificationShown", "true");
          }
        })
        .catch((err) => console.error("❌ SW registration failed:", err));
    }
  }, []);

  const sendWelcomeNotification = (registration) => {
    registration.showNotification("🎉 Welcome to Abhi Homes!", {
      body: "Find your perfect stay 🏡 Click to explore now!",
      icon: "/homes.jpg",
      vibrate: [200, 100, 200],
      requireInteraction: false,
    });
  };

  const handleExploreClick = () => {
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/search");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
      {/* 🔲 Video with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop className="w-full h-full object-cover">
          <source src="/bgvideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10"></div>
      </div>

      {/* 🔲 Hero Content */}
      <div className="relative z-20 flex flex-col justify-center items-center px-6 pt-36 pb-20 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-[2.8rem] sm:text-[3.8rem] md:text-[5rem] lg:text-[6rem] font-extrabold tracking-tight leading-tight"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          FIND YOUR
        </motion.h1>

        <motion.div
          className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <TypeAnimation
            sequence={[
              "Dream Home", 2000,
              "Luxury Stay", 2000,
              "Affordable House", 2000,
              "Rental Spot", 2000,
              "Perfect Apartment", 2000
            ]}
            speed={50}
            repeat={Infinity}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12"
        >
          <button
            onClick={handleExploreClick}
            className="px-7 py-3 rounded-full text-lg font-semibold text-white border border-white/40 bg-white/10 backdrop-blur-md hover:bg-white/20 transition duration-300 shadow-md"
          >
            🔍 Explore Homes
          </button>
        </motion.div>
      </div>

      {/* 🔲 Floating Popular Homes */}
      <div className="relative z-30 -mt-10 px-4 pb-16">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-white text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          POPULAR HOMES
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {["home1.jpg", "home2.jpeg", "home3.jpg", "home4.jpeg"].map((img, index) => (
            <motion.img
              key={index}
              src={`/${img}`}
              alt={`Home ${index + 1}`}
              className="rounded-xl w-full h-60 object-cover shadow-xl hover:shadow-2xl hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
