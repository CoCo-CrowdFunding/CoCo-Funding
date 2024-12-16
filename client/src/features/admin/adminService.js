import { toast } from "react-toastify";
import * as api from "../api";  // 假設你的 API 服務存在於這個位置
import { addAdminToLocalStorage, removeAdminFromLocalStorage} from "../../utils/localStorage";  // 假設這個方法是用來將用戶數據保存到 localStorage

// 管理員登入
const adminLogin = async (data, thunkAPI) => {
  try {
    // 調用 API 服務，將登入資料發送到後端
    const response = await api.adminLogin(data);
    console.log("API response:", response); // 確保這裡有紀錄

    // 當登入成功時顯示成功提示
    toast.success("管理員登入成功！", {
      toastId: "adminLoginSuccess",
    });

    // 將管理員信息（例如 token）存儲到 localStorage
    addAdminToLocalStorage(response.data);

    return response.data;  // 返回後端返回的資料（例如 token）
  } catch (error) {
    // 處理錯誤並顯示錯誤提示
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "adminLoginError",
      theme: "colored",
    });

    // 返回錯誤訊息
    return thunkAPI.rejectWithValue(message);
  }
};

// 管理者登出
const adminLogout = async (thunkAPI) => {
  try {
    const response = await api.adminLogout();
    console.log("Logout response:", response);
    toast.success("管理者登出成功！", {
      toastId: "adminLogoutSuccess",
    });
    // Clear the admin from local storage...
    removeAdminFromLocalStorage();
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();
    toast.error(message, {
      toastId: "adminLogoutError",
      theme: "colored",
    });
    return thunkAPI.rejectWithValue(message);
  }
};

// 取得所有狀態為 0 的提案
const getAdminProposals = async () => {
  try {
    const response = await api.adminProposals(); // 呼叫後端 API
    return response.data; // 返回提案數據
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();
    toast.error(message, {
      toastId: "adminProposalsError",
      theme: "colored",
    });
    throw new Error(message); // 發生錯誤時拋出錯誤
  }
};

// 更新提案狀態
const updateProposalStatus = async (id, status) => {
  try {
    const response = await api.updateProposalStatus(id, status); // 傳遞狀態值到 API
    toast.success("提案狀態更新成功！", {
      toastId: "updateProposalStatusSuccess",
    });
    return response.data; // 返回更新後的提案資料
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();
    toast.error(message, {
      toastId: "updateProposalStatusError",
      theme: "colored",
    });
    throw new Error(message); // 拋出錯誤
  }
};

// 管理員註冊
const adminRegister = async (data) => {
  try {
    const response = await api.adminRegister(data); // 假設 API 路徑為 /admin_register
    toast.success("管理員註冊成功！", {
      toastId: "adminRegisterSuccess",
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "adminRegisterError",
      theme: "colored",
    });

    throw new Error(message);
  }
};

const adminServices = {
  adminLogin,
  adminLogout,
  getAdminProposals,
  updateProposalStatus,
  adminRegister,
};

export default adminServices;
