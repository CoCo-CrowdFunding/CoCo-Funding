import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import authService from "./authService";
// import { getUserFromLocalStorage } from "../../utils/localStorage";

// const user = getUserFromLocalStorage();
const user = "user";
const initialState = {
  user,
  token: user?.token,
  isLoggedIn: !!user?.token,
  isLoading: false,
};

export const login = createAsyncThunk(
  "/auth/login",
  async (formData, thunkAPI) => {
    // 模擬或調用 API
    // return await authService.login(formData, thunkAPI);
  }
);

export const logout = createAsyncThunk("/auth/logout", async (thunkAPI) => {
  // 模擬或調用 API
  // return await authService.logout(thunkAPI);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload?.token;
        state.isLoggedIn = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoggedIn = false;
        state.isLoading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
