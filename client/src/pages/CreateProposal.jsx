import React, { useState } from "react"; // 引入 React 及其 useState hook
import { useDispatch, useSelector } from "react-redux"; // 引入 useDispatch hook 來自 react-redux
import { useNavigate } from "react-router-dom";
import Input from "./layout/Input"; // 引入自定義的 Input 組件
import Title from "./layout/Title"; // 引入自定義的 Title 組件
import Button from "./layout/Button"; // 引入自定義的 Button 組件
import { FaAngleDown } from "react-icons/fa";

import { proposalAdd } from "../features/proposal/proposalSlice"; // 從 proposalSlice 中引入 createProposal action

const Menus = [
  { key: "音樂", value: "音樂" },
  { key: "攝影", value: "攝影" },
  { key: "出版", value: "出版" },
  { key: "時尚", value: "時尚" },
  { key: "設計", value: "設計" },
  { key: "戶外", value: "戶外" },
  { key: "藝術", value: "藝術" },
  { key: "科技", value: "科技" },
  { key: "美食與飲品", value: "美食與飲品" },
  { key: "地方創生", value: "地方創生" },
];

const CreateProposal = () => {
  const user_id = useSelector((state) => state.user.user_id);

  // 定義 CreateProposal 組件
  const [formData, setFormData] = useState({
    // 使用 useState hook 定義 formData 狀態
    title: "", // 初始值為空字串
    description: "", // 初始值為空字串
    funding_goal: "", // 初始值為空字串
    start_date: "", // 初始值為空字串
    end_date: "", // 初始值為空字串
    category: "", // 初始值為空字串
    establish_user_id: user_id,
    cover_image: null, // 初始值為 null
  });

  const [open, setOpen] = useState(false); // 控制下拉選單的顯示
  const [selectedCategory, setSelectedCategory] = useState(""); // 控制選中的分類顯示

  const { title, description, funding_goal, start_date, end_date, category } =
    formData; // 解構 formData 狀態

  const dispatch = useDispatch(); // 使用 useDispatch hook 獲取 dispatch 函數
  const navigate = useNavigate(); // 使用 useNavigate hook 獲取 navigate 函數

  const handleChange = (e) => {
    // 定義 handleChange 函數來處理輸入變更
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

  const handleCategoryClick = (menu) => {
    setFormData((prevState) => ({
      ...prevState,
      category: menu.value,
    }));
    setSelectedCategory(menu.key);
    setOpen(false); // 選擇後關閉下拉選單
  };

  const toggleDropdown = () => {
    setOpen(!open); // 切換下拉選單的顯示狀態
  };

  const handleSubmit = (e) => {
    // 定義 handleSubmit 函數來處理表單提交
    e.preventDefault(); // 防止表單默認提交行為

    // 創建一個 FormData 物件來處理文件上傳
    const formDataToSend = new FormData();

    // 將表單數據逐一加入 FormData 物件
    formDataToSend.append("title", title);
    formDataToSend.append("description", description);
    formDataToSend.append("funding_goal", funding_goal);
    formDataToSend.append("start_date", start_date);
    formDataToSend.append("end_date", end_date);
    formDataToSend.append("category", category);
    formDataToSend.append("establish_user_id", formData.establish_user_id);
    formDataToSend.append("cover_image", formData.cover_image); // 上傳圖片

    dispatch(proposalAdd(formDataToSend)).then(() => {
      navigate("/all-proposals"); // 成功新增後跳轉到 /all-proposals
    }); // 派發 createProposal action 並傳遞 formData
  };

  return (
    // 返回組件的 JSX 結構
    <div>
      <Title pageTitle="新增提案" />{" "}
      {/* 渲染 Title 組件並設置 pageTitle 屬性 */}
      <div className="flex max-w-md flex-col items-center  px-4 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex flex-col items-center justify-center w-full py-8 px-2 bg-white rounded-lg shadow dark:bg-gray-100">
          <Input
            labelName="標題"
            name="title"
            type="text"
            placeholder="輸入標題"
            onChange={handleChange}
            value={title}
          />{" "}
          {/* 渲染 Input 組件並設置相關屬性 */}
          <div className="relative w-full">
            <label className="block text-lg font-bold text-gray-900 ">
              分類
            </label>
            <div className="flex items-center">
              <input
                value={selectedCategory}
                readOnly
                placeholder="分類"
                className="text-black ring-1 ring-slate-300 font-medium mt-2 mb-2 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
              ></input>
              <button
                onClick={toggleDropdown}
                type="button"
                className="mt-5 ml-2"
              >
                <FaAngleDown className="w-5 h-5 ms-1 mb-4" />
              </button>
            </div>
            {open && (
              <div
                id="dropdown"
                className="z-10 absolute mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-full"
              >
                <ul className="py-2 text-sm">
                  {Menus.map((menu) => (
                    <li
                      key={menu.key}
                      onClick={() => handleCategoryClick(menu)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {menu.key}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="text-xl mb-4 w-full">
            {/* <label htmlFor="description" className="block text-sm font-medium text-gray-700"> */}
            描述
            {/* </label> */}
            <textarea
              id="description"
              name="description"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
              placeholder="輸入標題描述"
              onChange={handleChange}
              value={description}
            />
          </div>
          <Input
            labelName="目標金額"
            name="funding_goal"
            type="number"
            placeholder="輸入目標金額"
            onChange={handleChange}
            value={funding_goal}
          />{" "}
          {/* 渲染 Input 組件並設置相關屬性 */}
          <Input
            labelName="開始日期"
            name="start_date"
            type="date"
            value={start_date}
            onChange={handleChange}
            placeholder="Start Date"
          />
          <Input
            labelName="結束日期"
            name="end_date"
            type="date"
            value={end_date}
            onChange={handleChange}
            placeholder="End Date"
          />
          <Input
            labelName="封面照片"
            name="cover_image"
            type="file"
            onChange={handleChange}
          />
          <Button buttonName="提出提案" onClick={handleSubmit} />{" "}
          {/* 渲染 Button 組件並設置 onClick 屬性 */}
        </div>
      </div>
    </div>
  );
};

export default CreateProposal; // 將 CreateProposal 組件作為默認導出
