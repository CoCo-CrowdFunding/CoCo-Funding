// Import necessary packages
require("dotenv").config(); // 載入 .env 文件中的環境變數
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Import models
const Proposal = require("../model/proposal-model");
const User = require("../model/user-model");
const Admin = require("../model/admin-model");

// Admin Register
exports.admin_register = async (req, res) => {
  try {
    const { username, email, password } = req.body; // 從請求體中獲取管理員資料
    if (!username || !email || !password) {
      return res
        .status(400)
        .send("All fields are required:username, email, password");
    }

    const newAdmin = new Admin({
      username, // 設定用戶名
      email, // 設定電子郵件
      password, // 設定雜湊後的密碼
      created_at: new Date(), // 設定創建時間
    });

    await newAdmin.save(); // 將新管理員保存到數據庫中
    res.status(201).send("Admin registered successfully"); // 返回註冊成功的響應
  } catch (error) {
    res.status(500).send("Error registering admin: " + error.message); // 返回錯誤信息
  }
};

// Admin Login
exports.admin_login = async (req, res) => {
  try {
    const { email, password } = req.body; // 從請求體中獲取用戶名和密碼
    const admin = await Admin.findOne({ email }); // 查找管理員
    if (!admin) return res.status(400).send("Invalid username or password"); // 如果未找到用戶，返回錯誤

    const validPassword = await bcrypt.compare(password, admin.password); // 驗證密碼是否正確rypt    if (!validPassword) return res.status(400).send('Invalid username or password'); // 如果密碼不正確，返回錯誤
    if (!validPassword) {
      return res.status(400).send("Invalid username or password");
    } // 如果密碼不正確，返回錯誤
    const token = jwt.sign(
      { _id: admin._id, username: admin.username },
      process.env.SECRET_KEY
    ); // 生成 JWT 令牌
    res.header("Authorization", token).send({ token }); // 在響應中返回令牌
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message); // 返回錯誤信息
  }
};

// Admin Logout
exports.admin_logout = (req, res) => {
  res.header("Authorization", "").send("Admin logged out successfully"); // 清除令牌並返回登出成功的響應
};

// Admin Edit User Data (self)
exports.edit_admin_data = async (req, res) => {
  try {
    const { username, password } = req.body; // 從請求體中獲取新用戶名和密碼
    const updates = {}; // 更新對象
    if (!username) return res.status(400).send("Invalid username or password"); // 如果未找到用戶，返回錯誤
    if (!password) {
      return res.status(400).send("Invalid username or password");
    } // 如果密碼不正確，返回錯誤
    if (username) updates.username = username; // 如果有提供用戶名，更新用戶名
    if (password) {
      const salt = await bcrypt.genSalt(10); // 生成鹽值
      updates.password = await bcrypt.hash(password, salt); // 雜湊新的密碼
    }

    const updatedAdmin = await Admin.findOneAndUpdate({}, updates, {
      new: true,
    }); // 更新管理員資料，因為只有一個管理員，不用提供 ID
    res.status(200).send(updatedAdmin); // 返回更新後的管理員資料
  } catch (error) {
    res.status(500).send("Error updating admin data: " + error.message); // 返回錯誤信息
  }
};

// Admin Get All Users
exports.admin_get_all_users = async (req, res) => {
  try {
    const users = await User.find(); // 查找所有管理員用戶
    res.status(200).send(users); // 返回用戶列表
  } catch (error) {
    res.status(500).send("Error retrieving users: " + error.message); // 返回錯誤信息
  }
};

// Admin Delete User
exports.admin_delete_user = async (req, res) => {
  try {
    const userId = req.params.id;

    // 驗證 user_id 是否為數字
    if (isNaN(userId)) {
      return res.status(400).send("Invalid user ID");
    }

    const deletedUser = await User.findOneAndDelete({ user_id: Number(userId) });
    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
};


// Admin Get All Proposals with Status = 0
exports.admin_proposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ status: 1 }); // 查找所有狀態為 1 的提案
    res.status(200).send(proposals); // 返回提案列表
  } catch (error) {
    res.status(500).send("Error retrieving proposals: " + error.message); // 返回錯誤信息
  }
};

// Admin Update Proposal Status
exports.update_proposal_status = async (req, res) => {
  try {
    const proposalId = req.params.id; // 從請求參數中獲取提案 ID
    const { status } = req.body; // 從請求體中獲取狀態更新

    // 確認狀態值為 0（審核通過，上架中）、1（審核中）或 2（審核未通過）
    if (![0, 1, 2].includes(status)) {
      return res.status(400).send("Invalid status value. Must be 0, 1, or 2.");
    }

    const updatedProposal = await Proposal.findByIdAndUpdate(
      proposalId,
      { status },
      { new: true }
    ); // 更新提案狀態
    if (!updatedProposal) {
      return res.status(404).send("Proposal not found"); // 如果提案不存在，返回 404 錯誤
    }

    res.status(200).send(updatedProposal); // 返回更新後的提案
  } catch (error) {
    res.status(500).send("Error updating proposal: " + error.message); // 返回錯誤信息
  }
};
