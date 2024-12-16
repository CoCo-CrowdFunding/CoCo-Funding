import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as commentServices from "./commentService";

// Create async thunks for each API request

export const commentAdd = createAsyncThunk(
  "/comment/add",
  async (data, thunkAPI) => {
    return await commentServices.commentAdd(data, thunkAPI);
  }
);

export const getAllComment = createAsyncThunk(
  "/comment/get_all_comment/:proposal_id",
  async (proposal_id, thunkAPI) => {
    return await commentServices.getAllComment(proposal_id, thunkAPI);
  }
);

export const addRate = createAsyncThunk("/rate/add", async (data, thunkAPI) => {
  return await commentServices.addRate(data, thunkAPI);
});

export const getRate = createAsyncThunk(
  "/rate/:proposal_id",
  async (proposal_id, thunkAPI) => {
    return await commentServices.getRate(proposal_id, thunkAPI);
  }
);

export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (comment_id, thunkAPI) => {
    return await commentServices.deleteComment(comment_id, thunkAPI);
  }
);

// Initial state
const initialState = {
  comments: [],
  current_proposal_avg_rate: null,
  all_proposal_avg_rate: [],
  isLoading: false,
};

// Create the commentSlice with builder callback notation
const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle commentAdd
      .addCase(commentAdd.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        state.isLoading = false;
      })
      .addCase(commentAdd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(commentAdd.rejected, (state) => {
        state.isLoading = false;
      })

      // Handle getAllComment
      .addCase(getAllComment.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllComment.rejected, (state) => {
        state.isLoading = false;
        state.comments = [];
      })

      // Handle addRate
      .addCase(addRate.fulfilled, (state, action) => {
        state.current_proposal_avg_rate[action.payload.proposal_id] =
          action.payload;
        state.isLoading = false;
      })
      .addCase(addRate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addRate.rejected, (state) => {
        state.isLoading = false;
      })

      // Handle getRate
      .addCase(getRate.fulfilled, (state, action) => {
        state.current_proposal_avg_rate = action.payload;
        const existingIndex = state.all_proposal_avg_rate.findIndex(
          (rate) => rate.proposal_id === action.payload.proposal_id
        );

        if (existingIndex === -1) {
          state.all_proposal_avg_rate.push(action.payload);
        } else {
          state.all_proposal_avg_rate[existingIndex] = action.payload;
        }

        state.isLoading = false;
      })
      .addCase(getRate.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRate.rejected, (state) => {
        state.isLoading = false;
        state.current_proposal_avg_rate = null;
      })

      // Handle deleteComment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload.deletedComment._id
        );
        state.isLoading = false;
      })
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteComment.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default commentSlice.reducer;
