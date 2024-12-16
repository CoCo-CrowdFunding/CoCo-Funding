const mongoose = require('mongoose');

// 定義 Comment 模型的 schema
const commentSchema = new mongoose.Schema({
    comment_id: { type: String, unique: true }, // 使用 proposal_id 和遞增數生成
    proposal_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    rate: { type: Number, required: true }, // 新增評分的地方，要留言就要評分
    comment: { type: String, required: true },
    created: { type: Date, default: Date.now }
});

// 使用 proposal_id 和 comment_count 創建 comment_id
commentSchema.pre('save', async function (next) {
    if (this.isNew) {
        const count = await mongoose.model('Comment').countDocuments({ proposal_id: this.proposal_id });
        this.comment_id = `${this.proposal_id}-${count + 1}`;
    }
    next();
});

// 創建 Comment 模型並導出
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;  // 只導出 Comment 模型
