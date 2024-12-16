const Proposal = require("../model/proposal-model"); // 引入 Proposal 模型
const User = require("../model/user-model"); // 引入 User 模型
const Comment = require("../model/comment-model"); // 引入 Comment 模型

const mongoose = require("mongoose");

// POST 方法: 新增評論
exports.comment_add = async (req, res) => {
  try {
    const { proposal_id, user_id, rate, comment, created } = req.body;

    // 驗證必填欄位
    if (!proposal_id || !user_id || !comment || !created || !rate) {
      return res
        .status(400)
        .json({ message: "All fields are required, including rate." });
    }

    if (rate < 1 || rate > 5) {
      return res.status(400).json({ message: "Rate must be between 1 and 5." });
    }

    // 檢查是否已經存在相同 user_id 對應的 proposal_id 的評論
    const existingComment = await Comment.findOne({ proposal_id, user_id });
    if (existingComment) {
      return res
        .status(400)
        .json({ message: "User has already commented on this proposal." });
    }

    // 創建新的留言
    const newComment = new Comment({
      proposal_id,
      user_id,
      rate,
      comment,
      created,
    });

    // 儲存留言
    const savedComment = await newComment.save();

    // 找到對應的 Proposal
    const proposal = await Proposal.findOne({ proposal_id });
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found." });
    }

    // 更新 Proposal 的評分資訊
    const newTotalRates = (proposal.total_rate || 0) + rate;
    const newRateCount = (proposal.rate_count || 0) + 1;
    const newAverageRate = newTotalRates / newRateCount;

    // 更新 Proposal 的評分相關屬性
    proposal.avg_rate = parseFloat(newAverageRate.toFixed(2)); // 保留 2 位小數
    proposal.total_rate = newTotalRates;
    proposal.rate_count = newRateCount;

    // 將留言加入 Proposal 的 comments 陣列
    proposal.comments.push(savedComment);

    // 儲存更新後的 Proposal
    const updatedProposal = await proposal.save();

    // 回傳成功訊息和更新後的 Proposal
    res.status(201).json({
      message: "Comment and rate successfully added.",
      proposal: updatedProposal,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res
      .status(500)
      .json({
        message: "Failed to add comment and rate.",
        error: error.message,
      });
  }
};

// DELETE 方法: 刪除評論
exports.comment_delete = async (req, res) => {
  try {
    const { comment_id } = req.params;

    // 檢查是否提供 comment_id
    if (!comment_id) {
      return res.status(400).json({ message: "Comment ID is required." });
    }

    // 找到對應的評論
    const comment = await Comment.findOneAndDelete({ comment_id });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // 找到對應的 Proposal
    const proposal = await Proposal.findOne({
      proposal_id: comment.proposal_id,
    });
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found." });
    }

    // 如果評論有評分，更新 Proposal 的評分資訊
    if (comment.rate) {
      const newTotalRates = proposal.total_rate - comment.rate;
      const newRateCount = proposal.rate_count - 1;
      const newAverageRate =
        newRateCount > 0 ? newTotalRates / newRateCount : 0;

      // 更新 Proposal 的評分相關欄位
      proposal.avg_rate = parseFloat(newAverageRate.toFixed(2));
      proposal.total_rate = newRateCount > 0 ? newTotalRates : 0;
      proposal.rate_count = newRateCount > 0 ? newRateCount : 0;
    }

    // 從 Proposal 的 comments 陣列中移除該評論
    proposal.comments = proposal.comments.filter(
      (c) => c.comment_id !== comment_id
    );

    // 儲存更新後的 Proposal
    await proposal.save();

    // 成功刪除評論
    res.status(200).json({
      message: "Comment successfully deleted.",
      proposal,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ message: "Failed to delete comment.", error: error.message });
  }
};

// GET 方法: 檢視某個 proposal 的所有留言
exports.get_all_comment = async (req, res) => {
  try {
    const { proposal_id } = req.params; // 從路由參數中獲取 proposal_id

    // 檢查 proposal 是否存在
    const proposal = await Proposal.findOne({ proposal_id });
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // 查詢對應 proposal_id 的所有留言
    const comments = await Comment.find({ proposal_id }).sort({ created: -1 }); // 按創建時間降序排列留言

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this proposal" });
    }

    // 返回留言列表
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error getting comments:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve comments", error: error.message });
  }
};

// PATCH 方法: 更新評分
exports.add_rate = async (req, res) => {
  try {
    const { proposal_id, rate } = req.body;

    // 驗證輸入資料
    if (!proposal_id || rate === undefined || rate < 0 || rate > 5) {
      return res
        .status(400)
        .json({ message: "Invalid proposal ID or rate (0-5 required)." });
    }

    // 找到對應的 Proposal
    const proposal = await Proposal.findOne({ proposal_id });
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // 計算新的平均評分
    const newTotalRates = proposal.total_rate
      ? proposal.total_rate + rate
      : rate;
    const newRateCount = proposal.rate_count ? proposal.rate_count + 1 : 1;
    const newAverageRate = (newTotalRates / newRateCount).toFixed(2); // 四捨五入保留兩位小數

    // 更新 Proposal 的評分資訊
    proposal.avg_rate = parseFloat(newAverageRate); // 確保數據為浮點數
    proposal.total_rate = newTotalRates;
    proposal.rate_count = newRateCount;

    await proposal.save();

    res.status(200).json({
      message: "Rate successfully updated.",
      proposal_id,
      new_avg_rate: proposal.avg_rate,
    });
  } catch (error) {
    console.error("Error updating rate:", error);
    res
      .status(500)
      .json({ message: "Failed to update rate.", error: error.message });
  }
};

// GET 方法: 檢視評分
exports.get_rate = async (req, res) => {
  try {
    const { proposal_id } = req.params; // 從路由參數取得 proposal_id

    if (!proposal_id) {
      return res.status(400).json({ message: "Proposal ID is required." });
    }

    // 從資料庫中查詢 Proposal
    const proposal = await Proposal.findOne({ proposal_id });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found." });
    }

    // 回傳 avg_rate
    res.status(200).json({
      message: "Rate fetched successfully.",
      proposal_id: proposal.proposal_id,
      avg_rate: proposal.avg_rate,
    });
  } catch (error) {
    console.error("Error fetching rate:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch rate.", error: error.message });
  }
};
