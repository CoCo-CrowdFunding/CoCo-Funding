import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProposals } from "../../features/proposal/proposalSlice";
import ProposalCard from "../homepage/ProposalCard";

const ProposalList = ({ type }) => {
  const dispatch = useDispatch();
  const proposals = useSelector((state) => state.proposal.proposals); // 確認回傳的資料格式
  const isLoading = useSelector((state) => state.proposal.isLoading); // 獲取加載狀態
  const allRates = useSelector((state) => state.comment.all_proposal_avg_rate);

  useEffect(() => {
    dispatch(getAllProposals()); // 在組件加載時獲取提案
  }, [dispatch]);

  // 先過濾出 status 為 0 的提案
  const approvedProposals = proposals.filter(
    (proposal) => proposal.status === 0
  );

  // 根據 type 排序和篩選提案
  let sortedProposals = [];
  if (type === "popular") {
    sortedProposals = approvedProposals
      .slice()
      .sort((a, b) => {
        const rateA =
          allRates.find((rate) => rate.proposal_id === a.proposal_id)
            ?.avg_rate || 0;
        const rateB =
          allRates.find((rate) => rate.proposal_id === b.proposal_id)
            ?.avg_rate || 0;
        return rateB - rateA;
      })
      .slice(0, 10); // 取前10個提案
  } else if (type === "newest") {
    sortedProposals = approvedProposals
      .slice()
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
      .slice(0, 10); // 取前10個提案
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <h1 className="text-2xl">Loading...</h1>
        </div>
      ) : sortedProposals && sortedProposals.length > 0 ? (
        <div className="flex snap-x scroll-pl-6">
          <div className="flex">
            {sortedProposals.map((proposal) => (
              <ProposalCard
                key={proposal.proposal_id}
                proposal_id={proposal.proposal_id}
                category={proposal.category}
                title={proposal.title}
                description={proposal.description}
                funding_goal={proposal.funding_goal}
                current_total_amount={proposal.current_total_amount}
                start_date={proposal.start_date}
                end_date={proposal.end_date}
                status={proposal.status}
                funding_reached={proposal.funding_reached}
                image={proposal.cover_image} // 根據資料格式設置圖片
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <h1 className="text-2xl">
            No Proposals Now! <br />
          </h1>
        </div>
      )}
    </div>
  );
};

export default ProposalList;
