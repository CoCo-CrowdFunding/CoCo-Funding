const express = require('express');
const app = express();
app.use(express.json());
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
// 啟用 CORS 中介軟體
app.use(cors());

const UserController = require('../controllers/UserController');

// Middleware for authentication
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

router.post('/user_register', UserController.user_register);
router.post('/user_login', UserController.user_login);
router.post('/user_logout', authenticateToken, UserController.user_logout);
router.put('/user_edit/:user_id', authenticateToken, UserController.user_edit);
router.get('/user_get/:user_id', authenticateToken, UserController.user_get);
router.put('/user_edit_pwd/:user_id', authenticateToken, UserController.user_edit_pwd);
router.get('/user_get_sponsor_history/:user_id', authenticateToken, UserController.user_get_sponsor_history);
router.delete('/remove_purchase/:user_id/:proposal_id', authenticateToken, UserController.remove_purchase);
// router.get('/get_proposal_record/:user_id', authenticateToken, UserController.get_proposal_record);


module.exports = router;