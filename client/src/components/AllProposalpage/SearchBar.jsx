import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

const SearchBar = ({ setSearchKeyword }) => {
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchKeyword(keyword); //更新父組件狀態
  };

  const handleCancel = () => {
    setKeyword(""); // 清空本地狀態
    setSearchKeyword(""); // 清空父组件狀態，顯示所有提案
  };

  return (
    <div className="mt-5">
      <form onSubmit={handleSearch} className="flex items-center">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only "
        >
          搜尋
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <FaSearch className="w-5 h-5 ms-1 " />
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  "
            required
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <div className="flex ">
            <div>
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-800 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2 "
              >
                搜尋
              </button>
            </div>
          </div>{" "}
        </div>{" "}
        {keyword !== "" && (
          <button
            type="button" // 使用 button 類型
            aria-label="取消搜尋" // 添加可訪問性標籤
            onClick={handleCancel}
            className="w-5 h-5 ms-1 cursor-pointer"
          >
            <MdOutlineCancel />
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
