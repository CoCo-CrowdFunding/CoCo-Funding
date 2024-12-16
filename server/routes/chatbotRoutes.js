// 匯入必要的模組
const express = require("express");
const chatbotController = require("../controllers/chatbotController"); // 引入 ChatbotController

// 初始化 Express 路由器
const router = express.Router();

// 路由定義

// 處理推薦提案的路由
router.post("/recommend", chatbotController.recommand);
module.exports = router;
