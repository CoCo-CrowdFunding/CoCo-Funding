import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

const Dropdown = ({ setSelectedCategory }) => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategoryState] = useState("全部分類");

  const Menus = [
    { key: "全部分類", value: "" },
    { key: "音樂", value: "music" },
    { key: "攝影", value: "photography" },
    { key: "出版", value: "publishing" },
    { key: "時尚", value: "fashion" },
    { key: "設計", value: "design" },
    { key: "戶外", value: "outdoor" },
    { key: "藝術", value: "art" },
    { key: "科技", value: "technology" },
    { key: "美食與飲品", value: "food-and-drink" },
    { key: "地方創生", value: "local-revitalization" },
  ];

  const toggleDropdown = () => {
    setOpen(!open);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategoryState(category.key);
    setSelectedCategory(category.key); // 更新父组件的狀態
    setOpen(false);
  };

  return (
    <div className=" ml-10">
      <input
        value={selectedCategory}
        readOnly
        placeholder="全部分類"
        className="text-black ring-1 ring-slate-300 font-medium mt-5 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
      ></input>
      <button onClick={toggleDropdown} type="button" placeholder="Dropdown">
        <FaAngleDown className="w-5 h-5 ms-1 " />
      </button>

      {/* <!-- Dropdown menu --> */}
      {open && (
        <div
          id="dropdown"
          className="z-10 absolute mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 "
        >
          <ul className="py-2 text-sm  " aria-labelledby="dropdownButton">
            {Menus.map((menu) => (
              <li
                key={menu.key}
                onClick={() => handleCategoryClick(menu)}
                className="block px-4 py-2 hover:bg-gray-100 "
              >
                {menu.key}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
