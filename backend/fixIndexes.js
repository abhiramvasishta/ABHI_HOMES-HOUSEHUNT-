const mongoose = require("mongoose");
require("dotenv").config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/homes", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to DB ✅");

    const result = await mongoose.connection.db.collection("users").dropIndex("googleId_1");
    console.log("Dropped googleId_1 index ✅", result);

    await mongoose.disconnect();
  } catch (err) {
    console.error("⚠️ Error dropping index:", err.message);
  }
};

run();
