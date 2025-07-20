const express = require("express");
const fs = require("fs");
const path = require("path");
const mime = require("mime");
const multer = require("multer");

const {
  googleLogin,
  logout,
  getUser,
  uploadAvatar,
  updateMobile,
  registerUser,
  loginRenter,
} = require("../controllers/userController");

const { authenticateUser } = require("../middlewares/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// ✅ Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ Auth/User Routes
router.post("/register", registerUser);
router.post("/renterlogin", loginRenter);
router.post("/google-login", googleLogin); // ✅ FIXED: changed from `/login` to `/google-login`
router.post("/logout", logout);
router.get("/users", authenticateUser, getUser);
router.post("/upload-avatar", authenticateUser, upload.single("avatar"), uploadAvatar);
router.post("/update-mobile", updateMobile);

module.exports = router;
