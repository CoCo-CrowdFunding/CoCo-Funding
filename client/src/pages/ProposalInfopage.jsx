import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getProposalDetail } from "../features/proposal/proposalSlice";
import {
  getAllComment,
  commentAdd,
  deleteComment,
  getRate,
} from "../features/comment/commentSlice";
import { useDispatch, useSelector } from "react-redux";

const ProposalPage = () => {
  const dispatch = useDispatch();
  const proposalDetail = useSelector((state) => state.proposal.proposalDetail);
  const comments = useSelector((state) => state.comment.comments); // 從 Redux store 獲取評論數據
  const user_id = useSelector((state) => state.user.user_id);
  const totalRate = useSelector(
    (state) => state.comment.current_proposal_avg_rate
  );

  const [comment, setComment] = useState(""); // 儲存用戶評論
  const [rating, setRating] = useState(0); // 儲存用戶評分

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getProposalDetail(id));
      dispatch(getAllComment(id));
      dispatch(getRate(id));
    }
  }, [id, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment && rating > 0) {
      const commentData = {
        proposal_id: proposal_id,
        user_id: user_id /* 這裡需要獲取當前用戶的 ID */, // 添加用戶 ID
        comment: comment,
        rate: rating,
        created: new Date().toISOString(), // 添加創建時間
      };

      dispatch(commentAdd(commentData)).then(() => {
        // 提交成功後重新獲取評論列表
        dispatch(getAllComment(proposal_id));
        setComment(""); // 清空評論輸入框
        setRating(0); // 清空評分
      });
    }
  };

  const handleDelete = async (comment_id) => {
    const confirmDelete = window.confirm("您確定要刪除此評論嗎？");
    if (confirmDelete) {
      try {
        await dispatch(deleteComment(comment_id)).then();
      } catch (error) {
        console.error("刪除失敗:", error);
      }
      dispatch(getAllComment(proposal_id));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  if (!proposalDetail) {
    return <div>提案未找到</div>; // 如果未找到提案，顯示提示
  }

  const {
    title,
    proposal_id,
    description,
    category,
    cover_image,
    current_total_amount,
    funding_goal,
    start_date,
    end_date,
    funding_reached,
  } = proposalDetail;

  //贊助進度條
  const calculateFundingProgress = () => {
    return Math.min(
      Math.round((current_total_amount / funding_goal) * 100),
      100
    );
  };
  const handlePurchase = () => {
    navigate(`/payment/${id}`);
  };

  //設定封面圖片路徑
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const coverImageUrl = `${serverUrl}${cover_image}`;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Title pageTitle="提案資訊" />
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* 封面圖片 */}
        <img
          src={coverImageUrl} // 確認這裡的 cover_image 是正確的 URL
          alt={title}
          className="w-full h-[500px] object-cover md:rounded-t-lg"
        />

        <div className="p-6">
          {/* badge */}
          <div className="flex items-center gap-2 mb-2">
            {category && <span className="badge">{category}</span>}
            {/* {funding_reached !== undefined && (
              <span className="badge">
                {funding_reached === 1 ? "達成" : "尚未達成"}
              </span>
            )} */}
          </div>
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-gray-700 mb-4">{description}</p>
          <div className="flex items-center mb-4">
            <span className="text-blue-600 text-xl font-bold">
              ${current_total_amount.toLocaleString()}已募得的資金
            </span>
            <span className="ml-2 text-gray-600">
              目標為 ${funding_goal.toLocaleString()}
            </span>
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
              {current_total_amount.toLocaleString()} /{" "}
              {funding_goal.toLocaleString()} (已達成{" "}
              {calculateFundingProgress()}%)
            </span>
          </div>
          <div className="flex-col items-center mb-4 mt-2">
            <div className=" text-gray-600">
              開始時間：{formatDate(start_date)}
            </div>
            <div className=" text-gray-600">
              結束時間：{formatDate(end_date)}
            </div>
          </div>
          <button
            onClick={handlePurchase}
            className="w-full bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            購買提案
          </button>
        </div>
      </div>

      {/* 評論 */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">評論</h2>
        <div className="flex items-center mb-4">
          <h2 className="font-bold mr-2">
            平均評分：{totalRate?.avg_rate?.toFixed(1)}
          </h2>
          {totalRate && (
            <div className="flex">
              {Array.from(
                { length: Math.round(totalRate.avg_rate) },
                (_, i) => (
                  <i key={i} className="fas fa-star text-yellow-500"></i>
                )
              )}
              {Array.from(
                { length: 5 - Math.round(totalRate.avg_rate) },
                (_, i) => (
                  <i key={i} className="far fa-star text-yellow-500"></i>
                )
              )}
            </div>
          )}
        </div>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="bg-white p-4 mb-4 shadow rounded-lg">
              <div className="flex">
                <p className="text-gray-600 text-sm">
                  {new Date(comment.created).toLocaleDateString()}{" "}
                  {/* 修改日期格式 */}
                </p>
                <p className="text-gray-600 text-sm ml-4">
                  評分：
                  {Array.from({ length: comment.rate }, (_, i) => (
                    <i key={i} className="fas fa-star text-yellow-500"></i>
                  ))}
                  {Array.from({ length: 5 - comment.rate }, (_, i) => (
                    <i key={i} className="far fa-star text-yellow-500"></i>
                  ))}
                </p>
              </div>

              <p className="text-gray-800">{comment.comment}</p>
              <div className="flex justify-end mt-2">
                {comment.user_id === user_id && (
                  <button
                    className="text-red-800 hover:text-red-700"
                    onClick={() => handleDelete(comment.comment_id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">暫無評論</p>
        )}

        {/* 評論表單 */}
        <form
          className="bg-white p-4 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <h3 className="text-lg font-bold mb-2">添加評論</h3>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">評分</label>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fas fa-star cursor-pointer ${
                    star <= rating ? "text-yellow-500" : "text-gray-400"
                  }`}
                  onClick={() => setRating(star)}
                ></i>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="comment"
            >
              評論內容
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="comment"
              rows="3"
              placeholder="請輸入您的評論"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <button
            className={`${
              comment && rating
                ? "bg-blue-800 hover:bg-blue-700"
                : "bg-gray-300 "
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            type="submit"
            disabled={!comment || !rating}
          >
            提交評論
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProposalPage;
