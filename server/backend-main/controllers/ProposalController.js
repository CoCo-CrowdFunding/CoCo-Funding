const Proposal = require("../model/proposal-model"); // 引入 Proposal 模型
const User = require("../model/user-model"); // 引入 User 模型
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path"); // 引入 path 模組

//image upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
}).single("cover_image");

// POST 方法: 新增 Proposal
exports.proposal_add = (req, res) => {
  // 使用 multer 上傳圖片
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading image:", err);
      return res
        .status(500)
        .json({ message: "Image upload failed", error: err.message });
    }

    try {
      const {
        title,
        description,
        funding_goal,
        start_date,
        end_date,
        category,
        establish_user_id,
      } = req.body;

      if (
        !title ||
        !description ||
        !funding_goal ||
        !start_date ||
        !end_date ||
        !category ||
        !establish_user_id
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // 查詢資料庫中最大的 proposal_id
      const maxProposal = await Proposal.findOne()
        .sort({ proposal_id: -1 })
        .exec();
      const newProposalId = maxProposal ? maxProposal.proposal_id + 1 : 1;
      const cover_image = req.file ? `/uploads/${req.file.filename}` : null;
      // 創建 Proposal 並保存到資料庫
      const newProposal = new Proposal({
        _id: new mongoose.Types.ObjectId(),
        title,
        description,
        funding_goal,
        start_date,
        end_date,
        proposal_id: newProposalId,
        establish_user_id,
        category,
        cover_image,
      });

      const savedProposal = await newProposal.save();
      res.status(200).json(savedProposal); // 返回成功訊息
    } catch (error) {
      console.error("Error adding proposal:", error);
      res
        .status(500)
        .json({ message: "Error adding proposal", error: error.message });
    }
  });
};

// PUT 方法: 修改 Proposal
exports.proposal_edit = async (req, res) => {
  try {
    const { proposal_id } = req.params;
    const {
      title,
      description,
      funding_goal,
      start_date,
      end_date,
      status,
      category,
      establish_user_id,
      current_total_amount,
      funding_reached,
    } = req.body;

    if (!proposal_id) {
      return res.status(400).json({ message: "Proposal ID is required" });
    }

    const updatedProposal = await Proposal.findOneAndUpdate(
      { proposal_id: proposal_id },
      {
        title,
        description,
        funding_goal,
        start_date,
        end_date,
        status,
        category,
        establish_user_id,
        current_total_amount,
        funding_reached,
      },
      { new: true }
    );

    if (!updatedProposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json(updatedProposal);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating proposal", error: error.message });
  }
};

// DELETE 方法: 刪除 Proposal
exports.proposal_delete = async (req, res) => {
  const { proposal_id } = req.params;

  try {
    const deletedProposal = await Proposal.findOneAndDelete({ proposal_id });

    if (!deletedProposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res
      .status(200)
      .json({ message: "Proposal deleted successfully", deletedProposal });
  } catch (error) {
    console.error("Error deleting proposal:", error);
    res
      .status(500)
      .json({ message: "Error deleting proposal", error: error.message });
  }
};

// 取得所有 Proposal
exports.get_all_proposal = async (req, res) => {
  try {
    const proposals = await Proposal.find().select(
      "title proposal_id funding_goal current_total_amount category start_date end_date cover_image status"
    );
    console.log(proposals);

    res.status(200).json(proposals);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving proposals", error: error.message });
  }
};

// 取得 Proposal 詳細資料
exports.get_proposal_detail = async (req, res) => {
  try {
    const { proposal_id } = req.params;
    const proposalId = parseInt(proposal_id, 10);
    if (isNaN(proposalId)) {
      return res
        .status(400)
        .json({ message: "Invalid proposal_id, must be a number" });
    }

    const proposal = await Proposal.findOne({ proposal_id: proposalId }).select(
      "_id title description funding_goal start_date end_date status proposal_id establish_user_id current_total_amount funding_reached category comments cover_image"
    );

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json(proposal);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving proposal detail",
      error: error.message,
    });
  }
};

// 查詢 Proposal 狀態
exports.get_status = async (req, res) => {
  try {
    const { proposal_id } = req.params;

    const proposal = await Proposal.findOne({ proposal_id: proposal_id });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json({ status: proposal.status });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving proposal status",
      error: error.message,
    });
  }
};

// 更新 Proposal 狀態
exports.edit_status = async (req, res) => {
  try {
    const { proposal_id } = req.params;
    const { status } = req.body;

    if (status === undefined || typeof status !== "number") {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const proposal = await Proposal.findOne({ proposal_id: proposal_id });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    proposal.status = status;
    await proposal.save();

    res.status(200).json({
      message: "Proposal status updated successfully",
      status: proposal.status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating proposal status",
      error: error.message,
    });
  }
};

// 取得 Proposal 留言
exports.get_comments = async (req, res) => {
  try {
    const { proposal_id } = req.params;

    const proposal = await Proposal.findOne({
      proposal_id: parseInt(proposal_id),
    });

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (!Array.isArray(proposal.comments)) {
      return res
        .status(400)
        .json({ message: "No comments found for this proposal" });
    }

    const commentsList = proposal.comments.map((comment, index) => ({
      comment_number: index + 1,
      user_id: comment.user_id,
      content: comment.content,
      timestamp: comment.timestamp,
    }));

    res.status(200).json({
      message: "Comments retrieved successfully",
      proposal_id: proposal.proposal_id,
      title: proposal.title,
      total_comments: commentsList.length,
      comments: commentsList,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving comments", error: error.message });
  }
};

// 搜索 Proposal
exports.search_proposal = async (req, res) => {
  try {
    const { title, category } = req.query;

    const searchCriteria = {};

    if (title) {
      searchCriteria.title = { $regex: title, $options: "i" };
    }
    if (category) {
      searchCriteria.category = { $regex: category, $options: "i" };
    }

    const proposals = await Proposal.find(searchCriteria);

    if (proposals.length === 0) {
      return res
        .status(404)
        .json({ message: "No proposals found matching your search criteria" });
    }

    res.status(200).json({
      message: "Proposals retrieved successfully",
      proposals: proposals,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving proposals", error: error.message });
  }
};

// 取得某一 proposal 的所有贊助者
exports.get_proposal_sponsors = async (req, res) => {
  try {
    const proposalId = req.params.proposal_id; // 從 URL 參數取得 proposal_id

    // 查詢所有贊助過該提案的使用者
    const users = await User.find({
      "purchases_record.proposal_id": proposalId,
    }).select("user_id username email purchases_record"); // 選擇所需的欄位

    // 將結果格式化為所需的結構
    const sponsors = users.map((user) => ({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      purchases: user.purchases_record.filter(
        (purchase) => purchase.proposal_id == proposalId
      ), // 只保留對應 proposal_id 的贊助紀錄
    }));

    // 回傳所有贊助者資料
    res.status(200).json(sponsors);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving proposal sponsors",
      error: error.message,
    });
  }
};

// 根據使用者 ID 獲取提案紀錄
exports.get_proposal_record = async (req, res) => {
  try {
    // 從請求參數取得 user_id
    const userId = parseInt(req.params.user_id);

    // 檢查 user_id 是否為有效數字
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "user_id 必須是有效的數字格式。",
      });
    }

    // 查詢符合建立者 ID 的提案
    const proposals = await Proposal.find({ establish_user_id: userId });

    // 如果沒有找到提案
    if (!proposals.length) {
      return res.status(404).json({
        success: false,
        message: `使用者 ID ${userId} 沒有任何提案紀錄。`,
      });
    }

    // 格式化提案資料
    const proposalRecords = proposals.map((proposal) => ({
      proposal_id: proposal.proposal_id,
      title: proposal.title,
      description: proposal.description,
      funding_goal: proposal.funding_goal,
      start_date: proposal.start_date,
      end_date: proposal.end_date,
      status: proposal.status,
      current_total_amount: proposal.current_total_amount,
      funding_reached: proposal.funding_reached,
      category: proposal.category,
      comments: proposal.comments,
      avg_rate: proposal.avg_rate,
      rate_count: proposal.rate_count,
      total_rate: proposal.total_rate,
    }));

    // 成功回傳提案紀錄
    res.status(200).json({
      success: true,
      message: `成功找到使用者 ID ${userId} 的提案紀錄。`,
      data: proposalRecords,
    });
  } catch (error) {
    console.error("查詢提案紀錄失敗：", error.message);
    res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法獲取提案紀錄。",
      error: error.message,
    });
  }
};
