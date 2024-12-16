import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogin, userGet } from "../features/user/userSlice";
import "react-toastify/dist/ReactToastify.css";

import Input from "./layout/Input";
import Checkbox from "./layout/Checkbox";
import Title from "./layout/Title";
import Button from "./layout/Button";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user_id = useSelector((state) => state.user.user_id);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    dispatch(userLogin(formData)).then(() => {
      dispatch(userGet(user_id));
    });
    navigate("/");
  };

  return (
    <div>
      <div className="h-4/6">
        <Title pageTitle="Login" />
        <div className="flex max-w-md flex-col items-center justfiy-center px-4 py-8 mx-auto md:h-screen lg:py-0">
          <div className="flex flex-col items-center justfiy-center w-full py-8 px-2 bg-white rounded-lg shadow dark:bg-gray-100">
            <Input
              labelName="Email"
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={email}
              placeholder="Enter your email..."
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
            <Button buttonName="Login" onClick={handleLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
