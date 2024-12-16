import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProposals } from "../../features/proposal/proposalSlice";
import ProposalCard from "../homepage/ProposalCard";

const AllProposalList = ({ proposalData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProposals()); // 在組件加載時獲取提案
  }, [dispatch]);

  if (!proposalData || proposalData.length === 0) {
    return (
      <div
        data-testid="no-proposalst"
        className="flex justify-center items-center"
      >
        <h1 className="text-2xl">
          No Proposals Now!
          <br />
        </h1>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {proposalData.map((proposal) => (
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
            image={proposal.cover_image}
          />
        ))}
      </div>
    </div>
  );
};

export default AllProposalList;
