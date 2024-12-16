import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatbotServices from "./chatbotService";

// Create async thunks for each API request
export const recommendProposal = createAsyncThunk(
    "/chatbot/recommend",
    async (data, thunkAPI) => {
        return await chatbotServices.recommendProposal(data, thunkAPI);
    }
    );

const initialState = {
    recommendedProposals: [],
    manual: null,
    proposalDetails: {},
    loading: false,
    error: null,
};

const chatbotSlice = createSlice({
    name: "chatbot",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Handle recommend
        .addCase(recommendProposal.pending, (state) => {
          state.loading = true;
        })
        .addCase(recommendProposal.fulfilled, (state, action) => {
          state.loading = false;
          state.recommendedProposals = action.payload;
        })
        .addCase(recommendProposal.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
    },
  });
  
export default chatbotSlice.reducer;