const cors = require("cors");
require("dotenv").config(); // 載入環境變數
const express = require("express");

const connectDB = require("./config/database");
require("dotenv").config();
const path = require("path");
const app = express();
const proposalRoutes = require("./routes/proposalRoutes"); // 引入路由
const commentRoutes = require("./routes/commentRoutes"); // 引入路由
const userRoutes = require("./routes/userRoutes"); // 引入路由
const adminRoutes = require("./routes/adminRoutes"); // 引入路由
const paymentRoutes = require("./routes/paymentRoutes"); // 引入路由
const chatbotRoutes = require("./routes/chatbotRoutes"); // 引入路由

app.use(express.json()); // 要加這行才可以做 POST 請求啦!!!
app.use(cors()); // 跨來源資源共用

// 連接到 MongoDB
connectDB();

// 設定基本路由
app.get("/", (req, res) => {
  res.send("Hello, World!"); // 或您可以設定為其他回應
});

// 使用 proposalRoutes 並掛載到 /api
app.use("/api", proposalRoutes);
app.use("/api", commentRoutes);
app.use("/api", userRoutes);
app.use("/api", adminRoutes);
app.use("/api", paymentRoutes);
app.use("/api", chatbotRoutes);

// 設定上傳檔案的路徑
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.static("public")); // Serve static files from the 'public' folder

app.get("*", (req, res) => {
  console.log(path.join(__dirname, "build", "index.html"));

  res.sendFile(__dirname, "build", "index.html");
});

// 啟動伺服器並監聽 8080 埠
// 在測試環境中不要啟動服務器
if (process.env.NODE_ENV !== "test") {
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
