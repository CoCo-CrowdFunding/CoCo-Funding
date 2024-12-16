import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  userGetSponsorHistory,
  refundProposal,
} from "../../features/user/userSlice";
import { RiRefund2Line } from "react-icons/ri";

const FundingRecordTable = () => {
  const dispatch = useDispatch();
  const user_id = useSelector((state) => state.user.user_id);
  const userSponsorHistory = useSelector(
    (state) => state.user?.userSponsorHistory
  );

  useEffect(() => {
    dispatch(userGetSponsorHistory(user_id));
  }, [dispatch, user_id]);

  const handleRefund = (user_id, proposal_id) => {
    if (window.confirm("要申請該提案的所有退款嗎？")) {
      dispatch(refundProposal({ user_id, proposal_id: proposal_id })).then(
        () => {
          dispatch(userGetSponsorHistory(user_id));
        }
      );
    }
  };

  return (
    <div className="relative overflow-x-auto md:mx-40 sm:mx-10 mt-4">
      <h2 className="font-bold text-mainBlue text-2xl m-6 text-secondary text-center">
        贊助紀錄
      </h2>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
        <thead className=" text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" className="px-6 py-3">
              提案標題
            </th>
            <th scope="col" className="px-6 py-3">
              購買日期
            </th>
            <th scope="col" className="px-6 py-3">
              購買金額
            </th>
            <th scope="col" className="px-6 py-3">
              退款
            </th>
          </tr>
        </thead>
        <tbody>
          {userSponsorHistory?.map((purchase, index) => (
            <tr key={index} className="bg-white border-b ">
              <td className="px-6 py-4">{purchase.proposal_title}</td>
              <td className="px-6 py-4">
                {new Date(purchase.purchase_date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">${purchase.purchase_money}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() =>
                    handleRefund(user_id, Number(purchase.proposal_id))
                  }
                  className="text-red-800 hover:text-red-700"
                >
                  <RiRefund2Line size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FundingRecordTable;
