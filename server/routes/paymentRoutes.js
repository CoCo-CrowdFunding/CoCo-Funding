const express = require('express');
const app = express();
app.use(express.json());
const router = express.Router();

const cors = require('cors');
// 啟用 CORS 中介軟體
app.use(cors());
const paymentController = require('../controllers/PaymentController'); // 引入 PaymentController


// 更新提案金額並更新用戶提案數據
router.put('/purchase_proposal', paymentController.purchase_proposal);



module.exports = router;