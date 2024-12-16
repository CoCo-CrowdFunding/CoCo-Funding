const express = require("express");
const multer = require("multer");
const app = express();
app.use(express.json());

const router = express.Router();

const cors = require("cors");
// 啟用 CORS 中介軟體
app.use(cors());
const jwt = require("jsonwebtoken");
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization"); // 獲取 Authorization Header
  if (!authHeader)
    return res.status(401).send("Access denied. No token provided.");

  const token = authHeader.split(" ")[1]; // 提取 Bearer 後的部分
  if (!token)
    return res.status(401).send("Access denied. Invalid token format.");

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send("Invalid token.");
    req.user = user;
    next();
  });
};

const proposalController = require("../controllers/ProposalController"); // 引入 proposalController

// 新增提案（需要驗證）
router.post(
  "/proposal_add",
  authenticateToken,
  proposalController.proposal_add
);
// 修改提案（需要驗證）
router.put(
  "/proposal_edit/:proposal_id",
  authenticateToken,
  proposalController.proposal_edit
);
// 刪除提案（需要驗證）
router.delete(
  "/proposal_delete/:proposal_id",
  authenticateToken,
  proposalController.proposal_delete
);
// 取得所有提案（不需驗證）
router.get("/get_all_proposal", proposalController.get_all_proposal);
// 取得單一提案詳細資料（不需驗證）
router.get(
  "/get_proposal_detail/:proposal_id",
  proposalController.get_proposal_detail
);
// 查詢提案狀態（需要驗證）
router.get(
  "/get_status/:proposal_id",
  authenticateToken,
  proposalController.get_status
);
// 更改提案狀態（需要驗證）
router.patch(
  "/edit_status/:proposal_id",
  authenticateToken,
  proposalController.edit_status
);
// 取得提案留言（不需驗證）
router.get("/get_comments/:proposal_id", proposalController.get_comments);
// 搜尋提案（不需驗證）
router.get("/search_proposal", proposalController.search_proposal);
// 查詢贊助者（需要驗證）
router.get(
  "/get_proposal_sponsors/:proposal_id",
  authenticateToken,
  proposalController.get_proposal_sponsors
);
// 查詢提案者的所有提案（需要驗證）
router.get(
  "/get_proposal_record/:user_id",
  authenticateToken,
  proposalController.get_proposal_record
);

module.exports = router;
