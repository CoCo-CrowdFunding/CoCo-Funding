import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogout, userGet } from "../features/user/userSlice";
import { adminLogout } from "../features/admin/adminSlice"; // 用於處理管理員登出
import Dropdown from "./homepage/Dropdown";

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.token); //判斷有無user登入資料
  const user_id = useSelector((state) => state.user.user_id); // 獲取user_id
  const user_info = useSelector((state) => state.user.user); // 獲取user資料
  const admin = useSelector((state) => state.admin.admin); // 管理員資料

  const Menus = [
    { key: "Sign in", value: "/user/login" },
    { key: "Sign up", value: "/user/register" },
  ];

  const handleLogout = () => {
    console.log("登出");
    dispatch(userLogout());
    navigate("/");
  };

  const handleAdminLogout = () => {
    console.log("管理員登出");
    dispatch(adminLogout());
    navigate("/");
  };

  useEffect(() => {
    dispatch(userGet(user_id));
  }, [user_id]);

  return (
    <nav className="flex flex-wrap justify-between flex-[2_1_400px] w-full items-center">
      <div className="">
        <ul className="text-mainBlue font-semibold flex flex-end flex-auto w-60 px-6 justify-around text-center">
          <li className="px-0.1 w-16 my-1 font-bold">
            <Link to="/all-proposals">所有提案</Link>
          </li>
          <li className="px-0.1 w-16 my-1 font-bold">
            <Link to="/create-proposal">我要提案</Link>
          </li>
        </ul>
      </div>

      <div className="flex flex-row space-x-2">
        {/* 根據登入狀態顯示 Sign In 或 管理員/使用者的資訊 */}
        {!admin && !user ? (
          Menus.map((obj) => {
            if (obj.key !== "Sign in" && obj.key !== "Sign up") return null;
            return (
              <Link to={obj.value} key={obj.key}>
                <button className="text-white bg-blue-900 hover:bg-blue-700 focus:ring-blue-700 focus:outline-none focus:ring-4 font-bold rounded-full text-l min-w-40 max-w-fit h-12 text-center mx-2 my-2">
                  {obj.key}
                </button>
              </Link>
            );
          })
        ) : admin ? (
          <div className="flex items-center space-x-2 mr-24">
            <span className="text-xl font-bold mr-2">管理員</span>
            <Dropdown className="mx-4 mr-8" />
          </div>
        ) : user ? (
          <div className="flex items-center space-x-2 mr-24">
            <span className=" font-bold mr-4">歡迎 {user_info?.username}</span>
            <Dropdown className="mx-4 mr-8" />
          </div>
        ) : null}
      </div>
    </nav>
  );
};
export default Nav;
