// backend/seedHomes.js

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Home = require("./models/Home");
const Renter = require("./models/Renter");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/homes", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  }
};

const encodeImage = (filename) => {
  const imagePath = path.join(__dirname, "uploads", filename);
  const imageBuffer = fs.readFileSync(imagePath);
  return {
    base64: imageBuffer.toString("base64"),
    contentType: "image/jpeg", // or adjust based on actual type
  };
};

const seedHomes = async () => {
  try {
    await Home.deleteMany();
    await Renter.deleteMany();

    const dummyRenter = await Renter.create({
      firstname: "Abhiram",
      lastname: "Vasishta",
      email: "vasishtabhi2005@gmail.com",
      mobile: "8919984333",
      password: "password123",
    });

    const sampleHomes = [
      {
        title: "RISE COLLEGE",
        name: "RISE GROUP",
        mobile: "9876543210",
        street: "NH16",
        town: "VALLUR",
        district: "Prakasam",
        pincode: "523272",
        pluscode: "7J5P+2W Ongole, Andhra Pradesh",
        state: "Andhra Pradesh",
        rentprice: "5000",
        images: [encodeImage("sample1.jpg")],
        renter: dummyRenter._id,
        commits: [],
      },
      {
        title: "QIS Apartments",
        name: "QIS Residency",
        mobile: "9845678901",
        street: "Vengamukala Palem",
        town: "ongole",
        district: "Prakasam",
        pincode: "523001",
        pluscode: "7J5Q+2W Ongole, Andhra Pradesh",
        state: "Andhra Pradesh",
        rentprice: "9000",
        images: [encodeImage("sample2.jpg")],
        renter: dummyRenter._id,
        commits: [],
      },
      {
        title: "2BHK",
        name: "Green Villa",
        mobile: "9988776655",
        street: "Mahatma Nagar",
        town: "markapur",
        district: "Prakasam",
        pincode: "523316",
        pluscode: "7J8P+2W Markapur, Andhra Pradesh",
        state: "Andhra Pradesh",
        rentprice: "5000",
        images: [encodeImage("sample3.jpg")],
        renter: dummyRenter._id,
        commits: [],
      },
      {
        title: "2BHK",
        name: "Hasini Residency",
        mobile: "9867523421",
        street: "Hasini hospital road",
        town: "markapur",
        district: "Prakasam",
        pincode: "523316",
        pluscode: "7MV7+H2 Markapur, Andhra Pradesh",
        state: "Andhra Pradesh",
        rentprice: "8000",
        images: [encodeImage("sample4.jpg")],
        renter: dummyRenter._id,
        commits: [],
      },
      {
        title: "2BHK",
        name: "Dreamscape Homes",
        mobile: "9988776655",
        street: "Mangamur road",
        town: "ongole",
        district: "Prakasam",
        pincode: "523001",
        pluscode: "7J5Q+7W Ongole, Andhra Pradesh",
        state: "Andhra Pradesh",
        rentprice: "5000",
        images: [encodeImage("sample5.jpg")],
        renter: dummyRenter._id,
        commits: [],
      },


    ];

    await Home.insertMany(sampleHomes);
    console.log("✅ Homes seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

connectDB().then(seedHomes);
