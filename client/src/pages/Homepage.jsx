import React, { useRef, useEffect } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import Title from "../components/Title";
import ProposalList from "../components/homepage/ProposalList";
import Chatbot from "../components/Chatbot";

const HomePage = () => {
  // slide function
  const slider = useRef([]);
  const slideLeft = (index) => {
    slider.current[index].scrollLeft = slider.current[index].scrollLeft - 500;
  };
  const slideRight = (index) => {
    slider.current[index].scrollLeft = slider.current[index].scrollLeft + 500;
  };

  return (
    <div>
      <div>
        <Title pageTitle="熱門排行 | Popular Proposal" />
        <div className="flex items-center relative">
          <MdChevronLeft
            className="cursor-pointer opacity-50 hover:opacity-100"
            onClick={() => slideLeft(0)}
            size={40}
          />
          <div
            ref={(el) => (slider.current[0] = el)}
            className=" w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide"
          >
            <ProposalList type="popular" />
          </div>
          <MdChevronRight
            className="cursor-pointer opacity-50 hover:opacity-100"
            onClick={() => slideRight(0)}
            size={40}
          />
        </div>
      </div>

      <div>
        <Title pageTitle="最新提案 | Newest Proposal" />
        <div className="flex items-center relative">
          <MdChevronLeft
            className="cursor-pointer opacity-50 hover:opacity-100"
            onClick={() => slideLeft(1)}
            size={40}
          />
          <div
            ref={(el) => (slider.current[1] = el)}
            className=" w-full h-full overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide"
          >
            <ProposalList type="newest" />
          </div>
          <MdChevronRight
            className="cursor-pointer opacity-50 hover:opacity-100"
            onClick={() => slideRight(1)}
            size={40}
          />
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default HomePage;
