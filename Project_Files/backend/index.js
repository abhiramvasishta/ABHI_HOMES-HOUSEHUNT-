require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const homeRoutes = require("./routes/homeRouer");
const userRouter = require("./routes/userRouter");
const renterRouter = require("./routes/renterRouter");
const commitRoute = require("./routes/commitRoute");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://easyhomes.vercel.app"
];

// ✅ CORS middleware with custom origin check
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Allow preflight for all routes
app.options("*", cors());

// ✅ Allow credentials header globally
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/homes", homeRoutes);
app.use("/renter", renterRouter);
app.use("/user", userRouter);
app.use("/commit", commitRoute);

const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/homes";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("✅ MongoDB Connected");

    const User = require("./models/User");
    try {
      await User.collection.dropIndex("googleId_1");
      console.log("✅ Dropped duplicate googleId index.");
    } catch (err) {
      if (err.code === 27) {
        console.log("ℹ️ Index does not exist yet.");
      } else {
        console.error("❌ Error dropping index:", err);
      }
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
