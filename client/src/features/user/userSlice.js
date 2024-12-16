import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";
import { getUserFromLocalStorage } from "../../utils/localStorage";

const user = getUserFromLocalStorage();

const initialState = {
  user: null,
  token: user?.token || null,
  user_id: user?.user.user_id || null,
  userSponsorHistory: [],
  isLoggedIn: !!user?.token,
  isLoading: false,
};

export const userRegister = createAsyncThunk(
  "user/register",
  async (data, thunkAPI) => {
    return await userService.userRegister(data, thunkAPI);
  }
);

export const userLogin = createAsyncThunk(
  "user/login",
  async (data, thunkAPI) => {
    return await userService.userLogin(data, thunkAPI);
  }
);

export const userLogout = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    return await userService.userLogout(thunkAPI);
  }
);

export const userGet = createAsyncThunk(
  "user/get",
  async (user_id, thunkAPI) => {
    return await userService.userGet(user_id, thunkAPI);
  }
);

export const userEdit = createAsyncThunk(
  "user/edit",
  async ({ user_id, data }, thunkAPI) => {
    return await userService.userEdit(user_id, data, thunkAPI);
  }
);

export const userEditPwd = createAsyncThunk(
  "user/editPwd",
  async ({ user_id, data }, thunkAPI) => {
    return await userService.userEditPwd(user_id, data, thunkAPI);
  }
);

export const userGetSponsorHistory = createAsyncThunk(
  "user/getSponsorHistory",
  async (user_id, thunkAPI) => {
    return await userService.userGetSponsorHistory(user_id, thunkAPI);
  }
);

export const refundProposal = createAsyncThunk(
  "user/refundProposal",
  async ({ user_id, proposal_id }, thunkAPI) => {
    return await userService.refundProposal(user_id, proposal_id, thunkAPI);
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle userRegister
      .addCase(userRegister.fulfilled, (state, action) => {
        // state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(userRegister.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Handle userLogin
      .addCase(userLogin.fulfilled, (state, action) => {
        //state.user = action.payload;
        state.token = action.payload; // 更新 token
        state.isLoading = false;
      })
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Handle userLogout
      .addCase(userLogout.fulfilled, (state) => {
        state.user = null; // 清除用戶信息
        state.token = null; // 清除 token
        state.isLoggedIn = false; // 更新登錄狀態
        state.isLoading = false; // 更新加載狀態
      })
      .addCase(userLogout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Handle userEdit
      .addCase(userEdit.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.isLoading = false;
      })
      .addCase(userEdit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userEdit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Handle userGet
      .addCase(userGet.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(userGet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Handle userEditPwd
      .addCase(userEditPwd.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(userEditPwd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userEditPwd.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Handle userGetSponsorHistory
      .addCase(userGetSponsorHistory.fulfilled, (state, action) => {
        state.userSponsorHistory = action.payload.purchases_record;
        state.isLoading = false;
      })
      .addCase(userGetSponsorHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userGetSponsorHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      }) // Handle refundProposal
      .addCase(refundProposal.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(refundProposal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refundProposal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
