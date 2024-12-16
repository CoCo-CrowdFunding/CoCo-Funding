import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";
import { getAdminFromLocalStorage, addAdminToLocalStorage, removeAdminFromLocalStorage } from "../../utils/localStorage";

// 從 localStorage 取得管理員資料，初始化 token 和登入狀態
const admin = getAdminFromLocalStorage();

const initialState = {
  admin: admin || null,
  token: admin?.token || null,
  isLoggedIn: !!admin?.token,
  isLoading: false,
  error: null,
  proposals: [], 
};

// 管理員註冊
export const adminRegister = createAsyncThunk(
  "admin/register",
  async (data, thunkAPI) => {
    try {
      const response = await adminService.adminRegister(data);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 管理員登入
export const adminLogin = createAsyncThunk(
  "/admin_login",
  async (data, thunkAPI) => {
    const response = await adminService.adminLogin(data, thunkAPI);
    // 登入成功後保存資料到 localStorage
    addAdminToLocalStorage(response); // 保存 token 和管理員資料
    return response;
  }
);

// 管理員登出
export const adminLogout = createAsyncThunk(
  "admin_logout",
  async (_, thunkAPI) => {
    return await adminService.adminLogout(thunkAPI);
  }
);

// 取得所有狀態為 0 的提案
export const fetchAdminProposals = createAsyncThunk(
  "admin_proposals",
  async (_, thunkAPI) => {
    try {
      const proposals = await adminService.getAdminProposals(); // 呼叫服務獲取提案
      return proposals;  // 返回提案數據
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message); // 若有錯誤，返回錯誤信息
    }
  }
);

// 更新提案狀態
export const updateProposalStatus = createAsyncThunk(
  "admin/updateProposalStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const updatedProposal = await adminService.updateProposalStatus(id, status);
      return updatedProposal; // 返回更新後的提案資料
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// adminSlice
export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle adminLogin
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.token = action.payload.token; // 假設後端返回的是 token
        state.isLoggedIn = true;
        state.isLoading = false;
      })
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Handle adminLogout
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null; // 清除用戶信息
        state.token = null; // 清除 token
        state.isLoggedIn = false; // 更新登錄狀態
        state.isLoading = false; // 更新加載狀態
      })
      .addCase(adminLogout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Handle fetchAdminProposals
      .addCase(fetchAdminProposals.pending, (state) => {
        state.isLoading = true; // 加載中
      })
      .addCase(fetchAdminProposals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.proposals = action.payload; // 設置提案數據
      })
      .addCase(fetchAdminProposals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload; // 設置錯誤信息
      })
      // 處理 updateProposalStatus
      .addCase(updateProposalStatus.fulfilled, (state, action) => {
        const updatedProposal = action.payload;
        const index = state.proposals.findIndex(
          (proposal) => proposal._id === updatedProposal._id
        );
        if (index !== -1) {
          state.proposals[index] = updatedProposal; // 更新提案數據
        }
        state.isLoading = false;
      })
      .addCase(updateProposalStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProposalStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // 管理員註冊
      .addCase(adminRegister.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload;
      })
      .addCase(adminRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
