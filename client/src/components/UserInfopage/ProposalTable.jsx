import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // 導入 useNavigate
import {
  getUserProposals,
  proposalDelete,
} from "../../features/proposal/proposalSlice";

const ProposalTable = () => {
  const navigate = useNavigate(); // 使用 useNavigate
  const dispatch = useDispatch();
  const presentRecords = useSelector((state) => state.proposal.userProposal); //到時要改串user的自己提案紀錄
  const user_id = useSelector((state) => state.user.user_id);

  // 編輯按鈕
  const handleEdit = (proposal_id) => {
    navigate(`/edit-proposal/${proposal_id}`); // 導航到 EditProposal 頁面，並傳遞提案 ID
  };

  // 刪除提案 //redux怪怪的，api可以正常執行，但會一直跳出middleware的問題，搞好久，乾脆將錯就錯QQ(白癡是我用錯檔案)
  const handleDelete = async (proposal_id) => {
    const confirmDelete = window.confirm("您確定要刪除此提案嗎？");

    if (confirmDelete) {
      await dispatch(proposalDelete(proposal_id));
      dispatch(getUserProposals(user_id)); // 刪除提案後再次取得使用者提案紀錄
    }
  };
  useEffect(() => {
    dispatch(getUserProposals(user_id)); // 取得使用者提案紀錄
  }, [dispatch, user_id]);

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "審核通過";
      case 1:
        return "審核中";
      case 2:
        return "審核未通過";
      default:
        return "未知狀態";
    }
  };

  const getFundingReachedText = (fundingReached) => {
    return fundingReached === 0 ? "未達目標資金" : "已達目標資金";
  };

  return (
    <div className="relative overflow-x-auto md:mx-40 sm:mx-10 mt-4">
      <h2 className="font-bold text-mainBlue text-2xl m-6 text-secondary text-center">
        提案紀錄
      </h2>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className=" text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              提案標題
            </th>
            <th scope="col" className="px-6 py-3 ">
              提案描述
            </th>

            <th scope="col" className="px-6 py-3">
              狀態
            </th>
            <th scope="col" className="px-6 py-3">
              資金狀態
            </th>
            <th scope="col" className="px-6 py-3">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {presentRecords.map((record, index) => (
            <tr key={index} className="bg-white border-b">
              <td className="px-6 py-4">{record.title}</td>
              <td className="px-6 py-4  max-w-60 ">{record.description}</td>

              <td className="px-6 py-4">{getStatusText(record.status)}</td>
              <td className="px-6 py-4">
                {getFundingReachedText(record.funding_reached)}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleEdit(record.proposal_id)}
                  className="text-blue-800 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(record.proposal_id)}
                  className="text-red-800 hover:text-red-700 ml-2"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProposalTable;
