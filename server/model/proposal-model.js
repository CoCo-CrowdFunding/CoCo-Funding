const mongoose = require("mongoose");

// 定義 proposal schema
const proposalSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  description: { type: String, required: true },
  cover_image: { type: String, required: true }, // Base64 encoded image string
  funding_goal: { type: Number, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { type: Number, default: 1 }, // 默認值為 0
  proposal_id: { type: Number, required: true }, // 之後要改成自動生成 proposal_id
  establish_user_id: { type: Number, required: true }, // 之後要改成自動取得登入者的 user_id
  current_total_amount: { type: Number, default: 0 }, // 默認值為 0
  funding_reached: { type: Number, default: 0 }, // 默認值為 0
  category: { type: String, required: true },
  avg_rate: { type: Number, default: 0 }, // 默認值為 0
  total_rate: { type: Number, default: 0 }, // 默認值為 0
  rate_count: { type: Number, default: 0 }, // 默認值為 0
  comments: { type: Array, default: [] }, // 默認為空數組
  cover_image: { type: String, required: false },
});

// 創建 Proposal 模型
const Proposal = mongoose.model("Proposal", proposalSchema);

// Mongoose 會自動將模型名稱轉為小寫並加上複數形式，對應的資料表名稱為 "proposals"
module.exports = Proposal;
