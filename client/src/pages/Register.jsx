import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../features/user/userSlice";

import Input from "./layout/Input";
import Title from "./layout/Title";
import Button from "./layout/Button";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = (event) => {
    event.preventDefault();

    console.log("Registering user...");

    const formData = {
      username,
      email,
      password,
    };

    console.log(formData);

    dispatch(userRegister(formData));

    navigate("/user/login");
  };

  return (
    <div>
      <Title pageTitle="Register" />
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

          <Button buttonName="Register" onClick={handleRegister} />
        </div>
      </div>
    </div>
  );
};

export default Register;
