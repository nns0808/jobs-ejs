// utils/seed_db.js
const mongoose = require("mongoose");
const Job = require("../models/Job");
const User = require("../models/User");
const { faker } = require("@faker-js/faker");
const { FactoryBot } = require("factory-bot-ts"); // ✅ use FactoryBot
require("dotenv").config();

faker.locale = "en_US";

// Random password for the test user
const testUserPassword = faker.internet.password();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jobs-ejs-test")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// --- Define factories ---
FactoryBot.define(
  "user",
  {
    name: () => faker.person.fullName(),
    email: () => faker.internet.email(),
    password: () => testUserPassword,
  },
  User
);

FactoryBot.define(
  "job",
  {
    company: () => faker.company.name(),
    position: () => faker.person.jobTitle(),
    status: () =>
      ["interview", "declined", "pending"][Math.floor(Math.random() * 3)],
    createdBy: null, // placeholder
  },
  Job
);

// --- Seed database function ---
const seed_db = async () => {
  let testUser = null;

  try {
    console.log("Clearing existing collections...");
    await Job.deleteMany({});
    await User.deleteMany({});

    console.log("Creating test user...");
    testUser = await FactoryBot.create("user"); // ✅ use FactoryBot.create

    console.log("Creating 20 jobs...");
    for (let i = 0; i < 20; i++) {
      await FactoryBot.create("job", { createdBy: testUser._id });
    }

    console.log("Database seeding complete.");
  } catch (e) {
    console.log("Database error:", e.message);
    throw e;
  }

  return testUser;
};

module.exports = { testUserPassword, seed_db };