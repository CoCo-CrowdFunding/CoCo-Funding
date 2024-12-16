// Import necessary packages

const Proposal = require('../model/proposal-model');
const User = require('../model/user-model');
// 功能：更新 user 的 purchases_record 並更新 proposal 的 current_total_amount
exports.purchase_proposal=async (req, res) => {
  try {
    const { user_id, proposal_amount, proposal_id } = req.body;

    // 驗證必填字段是否存在
    if (!user_id || !proposal_amount || !proposal_id) {
      return res.status(400).send('User ID, proposal amount, and proposal ID are required');
    }

    // 查找 proposal
    const proposal = await Proposal.findOne({ proposal_id });
    if (!proposal) {
      return res.status(404).send('Proposal not found');
    }

    // 查找 user 並更新 purchases_record
    const user = await User.findOneAndUpdate(
      { user_id },
      {
        $push: {
          purchases_record: {
            proposal_id,
            proposal_title: proposal.title,
            purchase_date: new Date(),
            purchase_money: proposal_amount,
          },
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send('User not found');
    }

    // 更新 proposal 的 current_total_amount
    proposal.current_total_amount += proposal_amount;
    await proposal.save();

    res.status(200).send({ message: 'Purchase successful', user, updatedProposal: proposal });
  } catch (error) {
    res.status(500).send('Error processing purchase: ' + error.message);
  }
};
