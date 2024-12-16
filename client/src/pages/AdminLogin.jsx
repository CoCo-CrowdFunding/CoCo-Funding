import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../features/admin/adminSlice";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify"; // 引入 toast

import Input from "./layout/Input";
import Checkbox from "./layout/Checkbox";
import Title from "./layout/Title";
import Button from "./layout/Button";

const AdminLogin = () => {
  const admin_token = useSelector((state) => state.admin?.token);  // 使用可選鏈接避免錯誤
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // 如果 admin_token 存在，跳通知並跳轉到提案審核頁面
    if (admin_token) {
      toast.success("You are already logged in!");
      navigate("/admin/review");
    }
  }, [admin_token, navigate]); // 監聽 admin_token 的變化

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  /*const handleLogin = (event) => {
    event.preventDefault();
    console.log("Login button clicked. Form data:", formData);
    dispatch(adminLogin(formData));  // 發送登入請求
    // 這裡可以加登入成功後跳轉的邏輯
    navigate("/admin/review");
  };*/
  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Login button clicked. Form data:", formData);
  
    try {
      // 使用 unwrap 獲取 thunk 的返回值
      const result = await dispatch(adminLogin(formData)).unwrap();
  
      console.log("Login successful, result:", result);
  
      // 登入成功後跳轉
      navigate("/admin/review");
    } catch (error) {
      console.error("Login failed:", error);
      // 錯誤情況下停在原畫面，可以額外顯示錯誤提示
    }
  };
  

  return (
    <div>
      <div className="h-4/6">
        <Title pageTitle="Admin Login" />
        <div className="flex max-w-md flex-col items-center justfiy-center px-4 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex flex-col items-center justfiy-center w-full py-8 px-2 bg-white rounded-lg shadow dark:bg-gray-100">
        <form onSubmit={handleLogin} className="w-full">
              <Input
                labelName="Username"
                type="text"
                id="username"
                name="username"
                onChange={handleChange}
                value={username}
                placeholder="Enter your username..."
              />
              <Input
                labelName="Password"
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                value={password}
                placeholder="Enter your password..."
              />
              <Checkbox labelName="Remember me" />
              <Button buttonName="Login" type="submit" /> {/* 改為 type="submit" */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
