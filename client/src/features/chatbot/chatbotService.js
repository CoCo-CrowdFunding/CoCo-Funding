import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api";
import { toast } from "react-toastify";

// Async Thunks
const recommendProposal =
  async (data, thunkAPI) => {
    try {
      const response = await api.recommendProposal(data);
      toast.success("推薦提案成功！", {
        toastId: "recommendSuccess",

      });
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.err_msg) ||
        error.message ||
        error.toString();

      toast.error(message, {
        toastId: "recommendError",
        theme: "colored",
      });
      return thunkAPI.rejectWithValue(message);
    }
  }

  const chatbotServices = {
    recommendProposal,
  };
  
  export default chatbotServices;