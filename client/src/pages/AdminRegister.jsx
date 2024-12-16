import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { adminRegister } from "../features/admin/adminSlice";

import Input from "./layout/Input";
import Title from "./layout/Title";
import Button from "./layout/Button";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateInputs = () => {
    const newErrors = {};

    // Username validation
    if (username.length < 3 || username.length > 50) {
      newErrors.username = "Username must be between 3 and 50 characters.";
    }

    // Email validation
    if (!/^.+@.+\..+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(newErrors);

    // 如果 newErrors 是空物件，表示所有驗證通過
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    // 清除即時輸入的錯誤提示
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return; // 如果驗證不通過，停止提交
    }

    dispatch(adminRegister(formData));
    navigate("/admin/login");
  };

  return (
    <div>
      <Title pageTitle="Admin Register" />
      <div className="flex max-w-md flex-col items-center justfiy-center px-4 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex flex-col items-center justfiy-center w-full py-8 px-2 bg-white rounded-lg shadow dark:bg-gray-100">
          <Input
            labelName="Username"
            type="text"
            id="username"
            name="username"
            onChange={handleChange}
            value={username}
            placeholder="Enter your username..."
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">{errors.username}</p>
          )}

          <Input
            labelName="Email"
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            value={email}
            placeholder="Enter your email..."
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}

          <Input
            labelName="Password"
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            value={password}
            placeholder="Enter your password..."
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}

          <Button buttonName="Register" onClick={handleRegister} />
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
