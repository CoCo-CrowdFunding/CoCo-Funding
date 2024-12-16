// Import necessary packages
require("dotenv").config(); // 載入 .env 文件中的環境變數

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Proposal = require("../model/proposal-model"); // 引入 Proposal 模型

// Import models
//const Proposal = require('../model/proposal-model');
const User = require("../model/user-model");
const { purchase_proposal } = require("./PaymentController");

// 用戶註冊 輸入email name 和 password
exports.user_register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 獲取最大的用戶 ID，並在此基礎上創建新用戶
    const maxUser = await User.findOne().sort({ user_id: -1 }).exec();
    const newUserId = maxUser ? maxUser.user_id + 1 : 1;

    // 創建新用戶
    const newUser = new User({
      user_id: newUserId,
      username,
      email,
      password, // 明文密码，将由 pre("save") 钩子自动哈希
      purchases_record: [],
      present_record: [],
    });

    await newUser.save(); // 保存用户
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Error registering user: " + error.message);
  }
};

exports.user_login = async (req, res) => {
  try {
    const { email, password } = req.body; // 從請求體中獲取用戶名和密碼
    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(400).send("no user found"); // 如果未找到用戶，返回錯誤
    console.log(user.password);
    console.log(password);
    const validPassword = await bcrypt.compare(password, user.password); // 驗證密碼是否正確
    console.log(validPassword);

    if (!validPassword) {
      return res.status(400).send("Invalid username or password");
    } // 如果密碼不正確，返回錯誤
    else {
      const token = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.SECRET_KEY
      );

      res.header("Authorization", token).send({ token, user }); // 在響應中返回令牌
    }
    // 生成 JWT 令牌
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message); // 返回錯誤信息
  }
};

// Admin Logout
exports.user_logout = (req, res) => {
  res.header("Authorization", "").send("User logged out successfully"); // 清除令牌並返回登出成功的響應
};

exports.user_edit = async (req, res) => {
  try {
    const { user_id } = req.params; // 獲取用戶 ID
    const { username, password } = req.body; // 獲取更新的數據

    console.log("Update request received:", { user_id, username });

    // 如果需要更新密碼，先加密
    let updatedFields = { username };
    if (password) {
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    // 更新用戶信息
    const updatedUser = await User.findOneAndUpdate(
      { user_id: user_id }, // 確保 user_id 是正確的查詢字段
      updatedFields,
      { new: true, runValidators: true } // 返回更新後的用戶，並驗證字段
    );

    if (!updatedUser) {
      console.log("User not found for user_id:", user_id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User successfully updated:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

exports.user_get = async (req, res) => {
  try {
    const { user_id } = req.params;
    const userId = parseInt(user_id);
    console.log(userId);
    if (isNaN(userId)) {
      return res
        .status(400)
        .json({ message: "Invalid user_id, must be a number" });
    }

    const user = await User.findOne({ user_id: user_id }).select(
      "_id user_id username email create_at purchases_record present_record"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Error getting user data: " + error.message);
  }
};
exports.user_edit_pwd = async (req, res) => {
  //專門用在忘記密碼
  try {
    const { user_id } = req.params;
    const { password } = req.body; // 從請求體中獲取新用戶名和密碼
    let updatedFields = {};
    if (password) {
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }
    const updatedUser = await User.findOneAndUpdate(
      { user_id: user_id }, // 確保 user_id 是正確的查詢字段
      updatedFields,
      { new: true, runValidators: true } // 返回更新後的用戶，並驗證字段
    );
    // 如果有提供用戶名，更新用戶名

    if (!updatedUser) {
      console.log("User not found for user_id:", user_id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User successfully updated:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).send("Error updating user data: " + error.message); // 返回錯誤信息
  }
};
exports.user_get_sponsor_history = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user_purchases_record = await User.findOne({ user_id }).select(
      "purchases_record"
    );

    res.status(200).send(user_purchases_record);
  } catch (error) {
    res.status(500).send("Error getting user data: " + error.message);
  }
};

exports.remove_purchase = async (req, res) => {
  try {
    let { user_id, proposal_id } = req.params;

    // 驗證請求參數
    if (!user_id || !proposal_id) {
      return res
        .status(400)
        .send({ message: "user_id and proposal_id are required" });
    }

    // 確保 `proposal_id` 保持字串類型，避免數據類型不一致
    proposal_id = proposal_id.toString();

    console.log("Received user_id:", user_id);
    console.log("Received proposal_id:", proposal_id);

    // 找到用戶的購買記錄
    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // 檢查 `purchases_record` 是否存在並有效
    if (!user.purchases_record || user.purchases_record.length === 0) {
      return res
        .status(404)
        .send({ message: "No purchase records found for the user" });
    }

    console.log("User purchases_record:", user.purchases_record);

    // 找到符合條件的 `purchases_record`，同時兼容字串與數字類型的 `proposal_id`
    const purchasesToRemove = user.purchases_record.filter((record) => {
      // 處理 `record.proposal_id` 和 `proposal_id` 可能的類型差異
      return record.proposal_id.toString() === proposal_id;
    });

    console.log("Purchases to remove:", purchasesToRemove);

    // 如果沒有找到匹配的購買記錄
    if (purchasesToRemove.length === 0) {
      return res
        .status(404)
        .send({ message: "No matching purchase records found" });
    }

    // 計算總共需要減去的金額
    const totalAmountToDeduct = purchasesToRemove.reduce(
      (acc, record) => acc + record.purchase_money,
      0
    );

    console.log("Total amount to deduct:", totalAmountToDeduct);

    console.log("Total amount to deduct:", totalAmountToDeduct);

    // 執行 MongoDB $pull 操作
    const updatedUser = await User.findOneAndUpdate(
      { user_id },
      { $pull: { purchases_record: { proposal_id } } }, // 使用字串匹配
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .send({ message: "User not found or no matching record" });
    }

    console.log("Updated user:", updatedUser);

    // 更新 proposal 的 current_total_amount
    const updatedProposal = await Proposal.findOneAndUpdate(
      { proposal_id },
      { $inc: { current_total_amount: -totalAmountToDeduct } }, // 減去對應的金額
      { new: true }
    );

    if (!updatedProposal) {
      return res.status(404).send({ message: "Proposal not found" });
    }

    console.log("Updated proposal:", updatedProposal);

    // 返回成功響應
    res.status(200).send({
      message: "Purchase record removed and proposal updated successfully",
      user: updatedUser,
      proposal: updatedProposal,
    });
  } catch (error) {
    // 錯誤處理
    console.error(
      "Error removing purchase record and updating proposal:",
      error
    );
    res.status(500).send({
      message: "Error removing purchase record and updating proposal",
      error: error.message,
    });
  }
};

// // 根據使用者 ID 獲取提案紀錄
// exports.get_proposal_record = async (req, res) => {
//   try {
//     // 查詢建立者 ID 符合的提案
//     const proposals = await Proposal.find({ establish_user_id: user_id });

//     // 如果沒有找到提案
//     if (proposals.length === 0) {
//       return {
//         success: false,
//         message: `使用者 ID ${user_id} 沒有任何提案紀錄。`,
//         data: []
//       };
//     }

//     // 成功返回提案列表
//     return {
//       success: true,
//       message: `成功找到使用者 ID ${user_id} 的提案紀錄。`,
//       data: proposals
//     };
//   } catch (err) {
//     console.error('查詢提案紀錄失敗：', err.message);
//     return {
//       success: false,
//       message: '伺服器錯誤，無法獲取提案紀錄。',
//       data: []
//     };
//   }
// };
