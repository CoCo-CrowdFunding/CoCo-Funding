// 匯入必要的模組
const express = require("express");
const { MongoClient } = require("mongodb");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config(); // 載入 .env 檔案中的環境變數
const fetch = require("node-fetch"); // 新增 fetch 支援

// 初始化 MongoDB 客戶端
const client = new MongoClient(process.env.MONGO_URI);
let collection;
(async () => {
  try {
    await client.connect();
    const db = client.db("Crowdfunding_Platform");
    collection = db.collection("proposals");
    console.log("已成功連接到 MongoDB");
  } catch (err) {
    console.error("MongoDB 連線錯誤:", err);
    process.exit(1); // 無法連接資料庫時終止應用程式
  }
})();

// 初始化 Express 應用
const app = express();
app.use(express.json());
app.use(helmet()); // 增加安全性
app.use(cors()); // 啟用跨域資源共享

// Hugging Face API 設定
const HF_API_URL = "https://api-inference.huggingface.co/models/BAAI/bge-m3";
const HF_API_TOKEN = process.env.HUGGINGFACE_TOKEN; // 從環境變數中加載 Hugging Face Token

// Google Gemini Pro 查詢函數
async function queryGeminiPro(data) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    console.log("Google Gemini Pro API Key:", apiKey); // 檢查 API 金鑰是否正確加載
    console.log("Google Gemini Pro Request URL:", url); // 檢查請求的 URL 是否正確

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: data.inputs,
              },
            ],
          },
        ],
      }),
    });

    // 紀錄回應的原始狀態碼和文本內容
    const responseText = await response.text();
    console.log("Google Gemini Pro Response Status:", response.status);
    console.log("Google Gemini Pro Response Text:", responseText);

    // 處理 404 錯誤
    if (response.status === 404) {
      throw new Error(
        "404 Not Found: The requested resource or endpoint could not be found. Please check the API URL or model name."
      );
    }

    // 嘗試解析回應為 JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error("Failed to parse JSON response from Gemini Pro");
    }

    console.log("Google Gemini Pro Response JSON:", result); // 檢查 API 回應內容
    if (
      result.candidates &&
      result.candidates.length > 0 &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts.length > 0
    ) {
      return result.candidates[0].content.parts[0].text;
    } else {
      throw new Error("No valid content found in Gemini response");
    }
  } catch (error) {
    console.error(
      "Error in Google Gemini Pro query:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to get response from Gemini Pro");
  }
}

// Hugging Face 向量生成函數
async function generateQueryVector(data) {
    try {
      const response = await fetch(HF_API_URL, {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error(`Hugging Face API 回應錯誤: ${response.status} - ${errorMessage}`);
        
        // 伺服器錯誤，重試機制
        if (response.status >= 500) {
          console.warn("伺服器錯誤，重試中...");
          for (let i = 0; i < 3; i++) {
            const retryResponse = await fetch(HF_API_URL, {
              headers: {
                Authorization: `Bearer ${HF_API_TOKEN}`,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify(data),
            });
            if (retryResponse.ok) {
              const result = await retryResponse.json();
              return result;
            }
            console.warn(`重試次數 ${i + 1} 失敗`);
          }
        }
  
        throw new Error(`Hugging Face API error: ${response.status} - ${errorMessage}`);
      }
  
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error("向量生成錯誤:", error.message);
      throw new Error("Failed to generate query vector");
    }
  }
  

// 處理推薦提案的路由
// 在 chatbotController.js 中新增匯出函數
async function recommand(req, res) {
  try {
    const userQuery = req.body.user_query;
    const userCategory = req.body.category;

    if (!userQuery) {
      return res.status(400).json({ error: "缺少 user_query 參數" });
    }

    // 根據分類從資料庫獲取提案
    let proposals;
    if (userCategory) {
      proposals = await collection.find({ category: userCategory }).toArray();
    } else {
      proposals = await collection.find({}).toArray();
    }

    if (proposals.length === 0) {
      return res.status(404).json({ error: "找不到符合該分類的提案" });
    }

    const titlesAndDescriptions = proposals.map((proposal) => {
      let categoryWeight =
        userCategory && proposal.category === userCategory ? 0.5 : 1.5;
      return {
        text: `${proposal.title} ${proposal.description} ${proposal.category}`,
        weight: categoryWeight,
      };
    });

    // 使用 Hugging Face API 生成向量
    const result = await generateQueryVector({
      inputs: {
        source_sentence: userQuery,
        sentences: titlesAndDescriptions.map((item) => item.text),
      },
    });

    // 根據分類權重調整分數
    const weightedResults = result.map(
      (score, index) => score * titlesAndDescriptions[index].weight
    );

    // 找出最相關的提案
    const topResults = weightedResults
      .map((score, index) => ({ score, proposal: proposals[index] }))
      .filter((item) => item.score > 0.3) // 過濾低分項目
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // 選取最高的三個

    if (topResults.length === 0) {
      return res.status(404).json({ error: "找不到符合的相關提案" });
    }

    // 取得推薦提案的 proposal_id 和 title
    const recommendedProposals = topResults.map((item) => ({
      proposal_id: item.proposal.proposal_id, // 使用 proposal_id 欄位
      title: item.proposal.title,
    }));

    // 使用 Google Gemini Pro 生成建議回覆
    const proposalPrompt = `Please act as a crowdfunding platform chatbot. You have been implemented using the RAG method and have access to the following information. Your task is to transform this data into user-friendly language. Do not include the following message in your reply:

User input: Content they want to be recommended: ${userQuery}
Database results: The most relevant proposal information: ${recommendedProposals
      .map((p) => `${p.title}`)
      .join(", ")}

Based on the information above, recommend the proposal found in the database in no more than 50 words. The recommendation must mention the proposal's title and end with a positive note.`;

    const proposalResponse = await queryGeminiPro({ inputs: proposalPrompt });

    // 返回結果
    res.json({
      response: proposalResponse,
      proposals: recommendedProposals,
    });
  } catch (error) {
    console.error("Error in /recommend:", error);
    res.status(500).json({ error: `內部伺服器錯誤: ${error.message}` });
  }
}


module.exports = {
  recommand,
};