const express = require('express');
const app = express();
app.use(express.json());

const router = express.Router();

const cors = require('cors');
// 啟用 CORS 中介軟體
app.use(cors());

const mongoose = require('mongoose');

const commentController = require('../controllers/CommentController'); // 引入 CommentController
const jwt = require('jsonwebtoken');
const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization'); // 獲取 Authorization Header
    if (!authHeader) return res.status(401).send('Access denied. No token provided.');

    const token = authHeader.split(' ')[1]; // 提取 Bearer 後的部分
    if (!token) return res.status(401).send('Access denied. Invalid token format.');

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
};

// 新增留言
router.post('/comment_add', authenticateToken, commentController.comment_add);

// 刪除留言
router.delete('/comment_delete/:comment_id', authenticateToken, commentController.comment_delete);

// 取得某個提案的所有留言
router.get('/get_all_comment/:proposal_id', commentController.get_all_comment);

// 設置 PATCH 路由來更新 Proposal 的評分
router.patch('/add_rate', authenticateToken, commentController.add_rate);

// 查看proposal的評分
router.get("/get_rate/:proposal_id", commentController.get_rate);

module.exports = router;