import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "../components/AllProposalpage/Dropdown";
import SearchBar from "../components/AllProposalpage/SearchBar";
import AllProposalList from "../components/AllProposalpage/AllProposalList";
import Chatbot from "../components/Chatbot";
import { getAllProposals } from "../features/proposal/proposalSlice";

const AllProposalpage = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("全部分類");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    dispatch(getAllProposals()); // 在組件加載時獲取提案
  }, [dispatch]);

  const proposals = useSelector((state) => state.proposal.proposals); // 從 Redux store 中獲取提案資料

  // 過濾提案數據
  const filteredProposals = proposals.filter((proposal) => {
    const matchesCategory =
      selectedCategory === "全部分類" || proposal.category === selectedCategory;
    const matchesKeyword =
      (proposal.title && proposal.title.includes(searchKeyword)) ||
      (proposal.description && proposal.description.includes(searchKeyword));
    const isApproved = proposal.status === 0; // 只顯示審核通過的提案
    return matchesCategory && matchesKeyword && isApproved;
  });

  // slide function
  const slider = useRef([]);

  return (
    <div className="pl-20 pr-20">
      <div>
        <div className="flex justify-between items-center">
          <Dropdown setSelectedCategory={setSelectedCategory} />
          <SearchBar setSearchKeyword={setSearchKeyword} />
        </div>

        <hr className="mt-5" />

        <div className="relative">
          <div ref={(el) => (slider.current[0] = el)} className="w-full h-full">
            <AllProposalList proposalData={filteredProposals} />
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default AllProposalpage;
