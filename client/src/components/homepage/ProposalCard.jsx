import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { BsFillCartPlusFill } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { getRate } from "../../features/comment/commentSlice";
import { useDispatch, useSelector } from "react-redux";

const ProposalCard = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allRates = useSelector((state) => state.comment.all_proposal_avg_rate);

  const {
    proposal_id,
    title,
    description,
    funding_goal,
    current_total_amount,
    start_date,
    end_date,
    status,
    funding_reached,
    category,
    image, //本地圖片路徑，到時要改
  } = props;
  const currentProposalRate = allRates.find(
    (rate) => rate.proposal_id === proposal_id
  );
  useEffect(() => {
    dispatch(getRate(proposal_id));
  }, []);

  const calculateFundingProgress = () => {
    return Math.min(
      Math.round((current_total_amount / funding_goal) * 100),
      100
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  //導覽到付款頁面
  const handlePurchase = () => {
    navigate(`/payment/${proposal_id}`);
  };

  //設定封面圖片路徑
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const defaultImage = "/uploads/66.jpg";
  const coverImageUrl = image
    ? `${serverUrl}${image}`
    : `${serverUrl}${defaultImage}`;

  return (
    <div>
      <div className="shadow-md shadow-gray snap-center card my-6 mx-6 x-72 h-max sm:scale-100 scale-90">
        {/* 圖片 */}
        <Link
          to={`/proposal/${proposal_id}`}
          state={{
            proposal_id: proposal_id,
          }}
        >
          <img
            src={coverImageUrl} // 替換為實際的提案圖片路徑
            alt="提案圖片"
            className="object-cover w-full h-48 transition-all duration-300 hover:shadow-2xl opacity-90 hover:opacity-100"
          />
        </Link>
        {/* 內容 */}
        <div className="p-5 flex-col gap-3 text-left">
          <Link
            to={`/proposal/${proposal_id}`}
            state={{
              proposal_id: proposal_id,
            }}
          >
            {/* badge */}
            <div className="flex items-center gap-2">
              {category && <span className="badge">{category}</span>}

              {/* {funding_reached !== undefined && (
                <span className="badge">
                  {funding_reached === 1 ? "達成" : "尚未達成"}
                </span>
              )} */}
            </div>
            {/* title and description*/}
            <div className="h-[80px]">
              <h2 className="class-title">{title}</h2>{" "}
              <p className="text-ellipsis overflow-hidden max-h-12">
                {description}
              </p>{" "}
            </div>
            {/* average rate */}
            <div className="flex items-center mb-4">
              <h2 className="font-bold mr-2">
                平均評分：{currentProposalRate?.avg_rate?.toFixed(1) || "0.0"}
              </h2>
              <div className="flex">
                {Array.from(
                  { length: Math.round(currentProposalRate?.avg_rate || 0) },
                  (_, i) => (
                    <i key={i} className="fas fa-star text-yellow-500"></i>
                  )
                )}
                {Array.from(
                  {
                    length: 5 - Math.round(currentProposalRate?.avg_rate || 0),
                  },
                  (_, i) => (
                    <i key={i} className="far fa-star text-yellow-500"></i>
                  )
                )}
              </div>
            </div>
            {/* funding progress */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-700 h-2.5 rounded-full"
                  style={{ width: `${calculateFundingProgress()}%` }}
                ></div>
              </div>
              <span className="text-sm">
                {current_total_amount} / {funding_goal} (已達成{" "}
                {calculateFundingProgress()}%)
              </span>
            </div>
            {/* date */}
            <div className="mt-3 text-sm">
              <span>開始日期: {formatDate(start_date)}</span> <br />
              <span>結束日期: {formatDate(end_date)}</span>
            </div>
          </Link>
          {/* action buttons */}
          <div className="mt-5 flex gap-2">
            <button
              className="button-primary flex justify-center items-center"
              onClick={handlePurchase}
            >
              支持提案
              <BsFillCartPlusFill className="ml-2" />
            </button>
            <button className="button-loveicon">
              <AiFillHeart size={30} className="opacity-50" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
