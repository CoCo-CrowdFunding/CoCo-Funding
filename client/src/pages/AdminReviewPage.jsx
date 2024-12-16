import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 導入 useNavigate
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProposals,
  updateProposalStatus,
} from "../features/admin/adminSlice";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa"; // 導入圖示

const AdminReviewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 使用 useNavigate
  const { proposals, isLoading, error } = useSelector((state) => state.admin); // 從 Redux 中獲取提案數據

  useEffect(() => {
    dispatch(fetchAdminProposals()); // 加載提案數據
  }, [dispatch]);

  // 處理提案通過
  const handleApprove = (id) => {
    dispatch(updateProposalStatus({ id, status: 0 })); // 狀態 0 表示通過，上架中
  };

  // 處理提案拒絕
  const handleReject = (id) => {
    dispatch(updateProposalStatus({ id, status: 2 })); // 狀態 2 表示不通過
  };

  const handleViewDetails = (id) => {
    navigate(`/proposal/${id}`); // 導航到提案詳細頁面
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "審核通過，上架中";
      case 1:
        return "審核中";
      case 2:
        return "審核未通過";
      default:
        return "未知狀態";
    }
  };

  return (
    <div className="relative overflow-x-auto md:mx-20 sm:mx-30 mt-4 ">
      <h2 className="font-bold text-mainBlue text-2xl m-6 text-secondary text-center">
        提案審核
      </h2>
      {/* 加載狀態處理 */}
      {isLoading && <div>加載中...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              提案標題
            </th>
            <th scope="col" className="px-6 py-3">
              提案描述
            </th>
            <th scope="col" className="px-6 py-3">
              申請人
            </th>
            <th scope="col" className="px-6 py-3">
              狀態
            </th>
            <th scope="col" className="px-6 py-3">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((proposal, index) => (
            <tr key={index} className="bg-white border-b">
              <td className="px-6 py-4">{proposal.title}</td>
              <td className="px-6 py-4">{proposal.description}</td>
              <td className="px-6 py-4">
                {proposal.establish_user_id || "未知"}
              </td>
              <td className="px-6 py-4">{getStatusText(proposal.status)}</td>
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => handleViewDetails(proposal.proposal_id)}
                  className="flex items-center justify-center py-2 px-3 text-white bg-blue-800 hover:bg-blue-700 rounded-md text-center gap-2"
                >
                  <FaEye />
                  查看
                </button>
                {proposal.status === 1 && ( // 僅在審核中顯示操作按鈕
                  <>
                    <button
                      onClick={() => handleApprove(proposal._id)}
                      className="flex items-center justify-center py-2 px-3 text-white bg-green-800 hover:bg-green-700 rounded-md text-center gap-2"
                    >
                      <FaCheck />
                      通過
                    </button>
                    <button
                      onClick={() => handleReject(proposal._id)}
                      className="flex items-center justify-center py-2 px-3 text-white bg-red-800 hover:bg-red-700 rounded-md text-center gap-2"
                    >
                      <FaTimes />
                      不通過
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReviewPage;
