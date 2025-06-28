const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const mime = require("mime");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Google Login
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub, email, name, picture } = ticket.getPayload();

    let user = await User.findOne({ googleId: sub });

    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        name,
        avatar: picture,
      });
    } else {
      user.avatar = picture;
      await user.save();
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("authToken", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Invalid Google token" });
  }
};

// ✅ Logout
const logout = (req, res) => {
  res.clearCookie("authToken", {
    path: "/",
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.status(200).json({ message: "Logged out successfully" });
};

// ✅ Get Authenticated User
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v -password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Upload Avatar
const uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: "Avatar updated", avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update Mobile
const updateMobile = async (req, res) => {
  const { mobile } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.mobile = mobile;
    await user.save();

    res.json({ message: "Mobile updated" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Register via Email & Password
const registerUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

    await newUser.save();
    console.log("✅ Registered user:", email);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Login via Email & Password
const loginRenter = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    res.status(200).json({
      message: "Login successful",
      renterId: user._id,
      firstname: user.name,
      securityToken: token,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  googleLogin,
  logout,
  getUser,
  uploadAvatar,
  updateMobile,
  registerUser,
  loginRenter,
};
