import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Title from "./layout/Title";
import Button from "./layout/Button";
import Input from "./layout/Input";
import { userEdit, userGet } from "../features/user/userSlice";
import { toast } from "react-toastify";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const user_id = useSelector((state) => state.user.user_id);

  const [formData, setFormData] = useState({
    username: user?.username || "Default Username",
    newPassword: "",
    confirmNewPassword: "",
  });

  const { username, newPassword, confirmNewPassword } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match", {
        toastId: "passwordMismatch",
        theme: "colored",
      });
      return;
    }
    const updatedData = { username, password: newPassword };
    dispatch(userEdit({ user_id, data: updatedData }));
    navigate("/");
  };
  useEffect(() => {
    dispatch(userGet(user_id));
  }, [user_id]);

  useEffect(() => {
    setFormData({
      username: user?.username,
      newPassword: "",
      confirmNewPassword: "",
    });
  }, [user]);

  if (!user) {
    //return <div>Loading...</div>;
  }

  return (
    <div>
      <Title pageTitle="基本資訊及修改" />
      <div className="flex max-w-md flex-col items-center justfiy-center px-4 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex flex-col items-center justfiy-center w-full py-8 px-2 bg-white rounded-lg shadow dark:bg-gray-100">
          <Input
            labelName="Username"
            name="username"
            type="text"
            placeholder="Enter username"
            onChange={handleChange}
            value={username}
          />

          <Input
            labelName="New Password"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            onChange={handleChange}
            value={newPassword}
          />
          <Input
            labelName="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            placeholder="Confirm new password"
            onChange={handleChange}
            value={confirmNewPassword}
          />
          <Button buttonName="Save all" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
