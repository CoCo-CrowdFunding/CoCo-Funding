// 匯入必要的模組
const express = require('express');
const jwt = require('jsonwebtoken');  // 新增：導入 jsonwebtoken 模塊
const app = express();
app.use(express.json());

const router = express.Router();
const cors = require('cors');
// 啟用 CORS 中介軟體
app.use(cors());

const adminController = require('../controllers/AdminController'); // 引入 AdminController


// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization'); // 获取 Authorization Header
    if (!authHeader) return res.status(401).send('Access denied. No token provided.');
  
    const token = authHeader.split(' ')[1]; // 提取 Bearer 后的部分
    if (!token) return res.status(401).send('Access denied. Invalid token format.');
  
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) return res.status(403).send('Invalid token.');
      req.user = user; // 设置解析后的用户信息
      next(); // 调用下一个中间件
    });
};

// 路由定義

// 註冊新管理員
router.post('/admin_register', adminController.admin_register);

// 管理員登入
router.post('/admin_login', adminController.admin_login);

// 管理員登出
router.post('/admin_logout', adminController.admin_logout);

// 編輯管理員用戶資料（自身）
router.put('/edit_admin_data', authenticateToken, adminController.edit_admin_data);

// 取得所有管理員用戶
router.get('/admin_get_all_users', authenticateToken, adminController.admin_get_all_users);

// 刪除管理員用戶
router.delete('/admin_delete_user/:id', authenticateToken, adminController.admin_delete_user);

// 取得所有提案
router.get('/admin_proposals', authenticateToken, adminController.admin_proposals);

// 更新提案狀態
router.put('/update_proposal_status/:id', authenticateToken, adminController.update_proposal_status);

module.exports = router;
