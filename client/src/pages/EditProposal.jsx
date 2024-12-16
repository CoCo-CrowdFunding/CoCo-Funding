import React, { useState, useEffect } from "react"; // 引入 React 及其 hooks
import { useDispatch, useSelector } from "react-redux"; // 引入 useDispatch 和 useSelector hooks 來自 react-redux
import { useParams, useNavigate } from "react-router-dom"; // 引入 useParams 和 useNavigate hook 來自 react-router-dom
import Input from "./layout/Input"; // 引入自定義的 Input 組件
import Title from "./layout/Title"; // 引入自定義的 Title 組件
import Button from "./layout/Button"; // 引入自定義的 Button 組件
import {
  proposalEdit,
  getProposalDetail,
} from "../features/proposal/proposalSlice"; // 從 proposalSlice 中引入 proposalEdit 和 getProposalDetail actions

const EditProposal = () => {
  const dispatch = useDispatch(); // 使用 useDispatch hook 獲取 dispatch 函數
  const navigate = useNavigate(); // 使用 useNavigate
  const { id: proposal_id } = useParams(); // 使用 useParams hook 獲取提案 ID

  const proposal = useSelector((state) => state.proposal.proposalDetail); // 從 Redux 狀態中獲取提案數據

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    funding_goal: "",
    start_date: "",
    end_date: "",
    category: "",
    cover_image: null,
  });

  useEffect(() => {
    dispatch(getProposalDetail(proposal_id)); // 派發 action 獲取提案數據
  }, [dispatch, proposal_id]); // 添加依賴項

  useEffect(() => {
    if (proposal) {
      // 確保 proposal 不為 null
      setFormData({
        title: proposal.title,
        description: proposal.description,
        funding_goal: proposal.funding_goal,
        start_date: proposal.start_date,
        end_date: proposal.end_date,
        category: proposal.category,
        cover_image: proposal.cover_image,
      });
    }
  }, [proposal]); // 當 proposal 更新時設置 formData

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cover_image") {
      setFormData((prevState) => ({
        ...prevState,
        cover_image: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProposal = {
      title: formData.title,
      description: formData.description,
      funding_goal: formData.funding_goal,
      start_date: formData.start_date,
      end_date: formData.end_date,
      category: formData.category,
    };

    if (formData.cover_image) {
      updatedProposal.cover_image = formData.cover_image;
    }

    // 派發 proposalEdit action 並傳遞更新後的提案數據
    const resultAction = await dispatch(
      proposalEdit({ proposal_id, data: updatedProposal })
    );

    if (proposalEdit.fulfilled.match(resultAction)) {
      // 如果提案編輯成功，則跳轉到 ProposalTable
      navigate("/user/info/proposal-record"); // 替換為您的 ProposalTable 路徑
    }
  };

  //設定日期格式
  const formatDate = (dateString) => {
    if (!dateString) return ""; // 如果没有日期，返回空字符串
    return dateString.split("T")[0]; // 提取日期部分
  };
  return (
    <div>
      <Title pageTitle="修改提案" />
      <div className="flex max-w-md flex-col items-center px-4 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex flex-col items-center justify-center w-full py-8 px-2 bg-white rounded-lg shadow dark:bg-gray-100">
          <Input
            labelName="標題"
            name="title"
            type="text"
            placeholder="Enter proposal title"
            onChange={handleChange}
            value={formData.title}
          />
          <Input
            labelName="分類"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
          />
          <div className="text-xl mb-4 w-full">
            描述
            <textarea
              id="description"
              name="description"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
              placeholder="Enter proposal description"
              onChange={handleChange}
              value={formData.description}
            />
          </div>
          <Input
            labelName="目標金額"
            name="funding_goal"
            type="number"
            placeholder="Enter goal amount"
            onChange={handleChange}
            value={formData.funding_goal}
          />
          <Input
            labelName="開始日期"
            name="start_date"
            type="date"
            value={formatDate(formData.start_date)} // 使用 formatDate 函数格式化日期
            onChange={handleChange}
            placeholder="Start Date"
          />
          <Input
            labelName="結束日期"
            name="end_date"
            type="date"
            value={formatDate(formData.end_date)} // 使用 formatDate 函数格式化日期
            onChange={handleChange}
            placeholder="End Date"
          />
          <Input
            labelName="封面照片"
            name="cover_image"
            type="file"
            onChange={handleChange}
          />
          <Button buttonName="更新提案" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default EditProposal; // 將 EditProposal 組件作為默認導出
