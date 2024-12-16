import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // 引入 useDispatch
import {
  purchaseProposal,
  getProposalDetail,
} from "../features/proposal/proposalSlice"; // 引入 actions
import Input from "./layout/Input"; // 引入自定義的 Input 組件
import Title from "./layout/Title"; // 引入自定義的 Title 組件
import Button from "./layout/Button"; // 引入自定義的 Button 組件

const PaymentPage = () => {
  const { id: proposal_id } = useParams(); // 使用 useParams hook 獲取提案 ID
  const dispatch = useDispatch(); // 創建 dispatch 來觸發 Redux actions
  const navigate = useNavigate(); // 使用 useNavigate hook 來處理導航

  const [proposalData, setProposalData] = useState(null); // 初始化 proposalData 狀態
  const [amount, setAmount] = useState(""); // 記錄用戶選擇的金額
  const [paymentMethod, setPaymentMethod] = useState(null); // 記錄付款方式
  const user_id = useSelector((state) => state.user.user_id); // 從 Redux store 獲取用戶 ID
  const predefinedAmounts = [200, 500, 1000]; // 預設金額選項

  useEffect(() => {
    // 獲取提案詳細資料
    dispatch(getProposalDetail(proposal_id)).then((result) => {
      if (result.payload) {
        setProposalData(result.payload); // 設置提案資料
      }
    });
  }, [dispatch, proposal_id]); // 當 proposal_id 更新時重新獲取提案資料

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("請選擇付款方式");
      return;
    }
    if (!amount || amount <= 0) {
      alert("請輸入或選擇有效的付款金額");
      return;
    }

    // 彈出確認框
    const confirmPayment = window.confirm(
      `確認付款\n提案：${proposalData.title}\n金額：${amount} 元\n方式：${paymentMethod}`
    );

    if (confirmPayment) {
      try {
        // 將所有的參數封裝成一個 data 對象
        const data = {
          user_id: user_id,
          proposal_id,
          proposal_amount: amount,
          //payment_method: paymentMethod, // 添加付款方式
        };

        // 派發 action，並將 data 傳遞過去
        const resultAction = await dispatch(purchaseProposal(data));

        // 檢查是否成功
        if (purchaseProposal.fulfilled.match(resultAction)) {
          alert("付款成功！");
          navigate("/user/info/proposal-funding-record"); // 付款成功後跳轉
        } else {
          alert("付款失敗，請稍後再試！");
        }
      } catch (error) {
        console.error(error);
        alert("付款過程中出現錯誤，請稍後再試！");
      }
    }
  };

  if (!proposalData) {
    return <div>提案未找到</div>;
  }

  //設定封面圖片路徑
  const serverUrl = process.env.REACT_APP_SERVER_URL;
  const coverImageUrl = `${serverUrl}${proposalData.cover_image}`;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      <Title pageTitle="付款頁面" />

      {/* 提案封面照片 */}
      <div className="mb-4">
        <img
          src={coverImageUrl || "/default-image.jpg"} // 使用默認圖片如果沒有提案封面
          alt={proposalData.title}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* 提案資訊 */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold">{proposalData.title}</h2>
        <p className="text-gray-700 mb-2">{proposalData.description}</p>
        <p className="text-gray-700">
          目標金額：
          <span className="font-bold">${proposalData.funding_goal}</span>
        </p>
        <p className="text-gray-700">
          已募得金額：
          <span className="font-bold">
            ${proposalData.current_total_amount}
          </span>
        </p>
      </div>

      {/* 金額選項 */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">選擇或輸入付款金額</h3>
        <div className="flex gap-4 mb-4">
          {predefinedAmounts.map((preAmount) => (
            <button
              key={preAmount}
              onClick={() => setAmount(preAmount)}
              className={`py-2 px-4 rounded-lg ${
                amount === preAmount
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              ${preAmount}
            </button>
          ))}
        </div>
        <label className="block mb-2 text-gray-700 font-bold" htmlFor="amount">
          自訂金額
        </label>
        <input
          type="number"
          id="amount"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="1"
        />
      </div>

      {/* 付款方式選擇 */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">選擇付款方式</h3>
        <div className="flex gap-4">
          <button
            onClick={() => setPaymentMethod("ATM")}
            className={`flex-1 py-2 px-4 rounded-lg ${
              paymentMethod === "ATM"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            ATM
          </button>
          <button
            onClick={() => setPaymentMethod("Credit Card")}
            className={`flex-1 py-2 px-4 rounded-lg ${
              paymentMethod === "Credit Card"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            信用卡
          </button>
        </div>
      </div>

      {/* 確認付款按鈕 */}
      <Button buttonName="確認付款" onClick={handlePayment} />
    </div>
  );
};

export default PaymentPage;
