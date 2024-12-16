const mongoose = require("mongoose");

//把真正使用跟測試用得資料庫分開
const connectDB = async () => {
  // Check if we're in test environment
  const dbURI =
    process.env.NODE_ENV === "test"
      ? process.env.MONGO_URI_test
      : process.env.MONGO_URI;

  const dbName =
    process.env.NODE_ENV === "test"
      ? "Crowdfunding_Platform_test"
      : "Crowdfunding_Platform"; // Default to production database

  console.log(`Connecting to MongoDB...`);
  console.log(`Using URI: ${dbURI}`);

  try {
    await mongoose.connect(dbURI, {
      dbName, // Ensure we're connecting to the correct database
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected! Connected to ${dbName}`);
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

module.exports = connectDB;
