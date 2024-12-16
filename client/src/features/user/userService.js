import { toast } from "react-toastify";
import * as api from "../api";
import {
  addUserToLocalStorage,
  removeUserFromLocalStorage,
} from "../../utils/localStorage";

// 用戶註冊
const userRegister = async (data, thunkAPI) => {
  try {
    const response = await api.userRegister(data);
    toast.success("用戶註冊成功！", {
      toastId: "userRegisterSuccess",
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();
    toast.error(message, {
      toastId: "userRegisterError",
      theme: "colored",
    });
    return thunkAPI.rejectWithValue(message);
  }
};

// 用戶登入
const userLogin = async (data, thunkAPI) => {
  try {
    const response = await api.userLogin(data);
    toast.success("用戶登入成功！", {
      toastId: "userLoginSuccess",
    });
    // Add the user to local storage...
    addUserToLocalStorage(response.data);

    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();
    console.log("error:", error.response.data, "message:", message);
    toast.error(error.response.data, {
      toastId: "userLoginError",
      theme: "colored",
    });
    return thunkAPI.rejectWithValue(message);
  }
};

// 用戶登出
const userLogout = async (thunkAPI) => {
  try {
    const response = await api.userLogout();
    console.log("Logout response:", response);
    toast.success("用戶登出成功！", {
      toastId: "userLogoutSuccess",
    });
    // Clear the user from local storage...
    removeUserFromLocalStorage();
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();
    toast.error(message, {
      toastId: "userLogoutError",
      theme: "colored",
    });
    return thunkAPI.rejectWithValue(message);
  }
};

// 編輯用戶資料
const userEdit = async (user_id, data, thunkAPI) => {
  try {
    const response = await api.userEdit(user_id, data);
    toast.success("用戶資料更新成功！", {
      toastId: "userEditSuccess",
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();
    toast.error(message, {
      toastId: "userEditError",
      theme: "colored",
    });
    return thunkAPI.rejectWithValue(message);
  }
};

// 獲取用戶資料
const userGet = async (user_id, thunkAPI) => {
  try {
    const response = await api.userGet(user_id);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();
    // toast.error(message, {
    //   toastId: "userGetError",
    //   theme: "colored",
    // });
    return thunkAPI.rejectWithValue(message);
  }
};

// 更新用戶密碼
const userEditPwd = async (user_id, data, thunkAPI) => {
  try {
    const response = await api.userEditPwd(user_id, data);
    toast.success("密碼更新成功！", {
      toastId: "userEditPwdSuccess",
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();
    toast.error(message, {
      toastId: "userEditPwdError",
      theme: "colored",
    });
    return thunkAPI.rejectWithValue(message);
  }
};

// 獲取用戶贊助歷史
const userGetSponsorHistory = async (user_id, thunkAPI) => {
  try {
    const response = await api.userGetSponsorHistory(user_id);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();
    toast(message, {
      toastId: "userGetSponsorHistoryError",
    });
    return thunkAPI.rejectWithValue(message);
  }
};

// 退款請求
const refundProposal = async (user_id, proposal_id, thunkAPI) => {
  try {
    const response = await api.refundProposal(user_id, proposal_id);
    toast.success("退款請求成功！", {
      toastId: "refundProposalSuccess",
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();
    toast.error(message, {
      toastId: "refundProposalError",
      theme: "colored",
    });
    return thunkAPI.rejectWithValue(message);
  }
};

const userServices = {
  userRegister,
  userLogin,
  userLogout,
  userEdit,
  userGet,
  userEditPwd,
  userGetSponsorHistory,
  refundProposal,
};

export default userServices;
