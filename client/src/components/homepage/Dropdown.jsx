import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../features/user/userSlice";
import { adminLogout } from "../../features/admin/adminSlice"; // 用於處理管理員登出
import { useNavigate } from "react-router-dom";

const Dropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.token); // 確定用戶資料是否登入有無tokens
  const admin = useSelector((state) => state.admin.admin); // 管理員資料
  const [open, setOpen] = useState(false);

  // 用戶和管理員的選單選項
  const userMenus = [
    { key: "基本資訊及修改", value: "/user/profile" },
    { key: "贊助紀錄", value: "/user/info/proposal-funding-record" },
    { key: "提案紀錄", value: "/user/info/proposal-record" },
    { key: "Logout", value: "/user/logout" },
  ];

  const adminMenus = [
    { key: "提案審核", value: "/admin/review" },
    { key: "Logout", value: "/admin/logout" },
  ];

  const menuRef = useRef();
  const imgRef = useRef();

  // 登出處理函式
  const handleLogout = () => {
    if (user) {
      dispatch(userLogout());
    } else if (admin) {
      dispatch(adminLogout());
    }
    navigate("/");
  };

  // 點擊空白處關閉下拉選單
  window.addEventListener("click", (e) => {
    if (e.target !== menuRef.current && e.target !== imgRef.current) {
      setOpen(false);
    }
  });

  return (
    <div>
      <div className="relative">
        <button
          ref={imgRef}
          onClick={() => setOpen(!open)}
          className="
            object-cover cursor-pointer hover:ring-mainBlue rounded-xl w-10 h-10 flex justify-center items-center "
        >
          <FaUserCircle size={36} className="pointer-events-none" />
        </button>

        {open && (
          <div
            ref={menuRef}
            className="bg-gray-100 rounded-md text-mainBlue font-bold p-4 w-52 shadow-lg absolute -left-20 top-10"
          >
            <ul>
              {/* 根據身份顯示相應的選單項目 */}
              {(user || admin) && (
                <div>
                  {(user ? userMenus : adminMenus).map((obj) => {
                    if (obj.key === "Logout") {
                      return (
                        <li
                          onClick={handleLogout}
                          className="p-2 text-la cursor-pointer rounded hover:bg-mainBlue hover:text-white"
                          key={obj.key}
                        >
                          {obj.key}
                        </li>
                      );
                    } else {
                      return (
                        <Link to={obj.value} key={obj.key}>
                          <li
                            onClick={() => setOpen(false)}
                            className="p-2 text-la cursor-pointer rounded hover:bg-mainBlue hover:text-white"
                          >
                            {obj.key}
                          </li>
                        </Link>
                      );
                    }
                  })}
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
