import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import proposalServices from "./proposalService";

// Create async thunks for each API request

// Create async thunk for purchase proposal
export const purchaseProposal = createAsyncThunk(
  "/purchase_proposal",
  async (data, thunkAPI) => {
    return await proposalServices.purchaseProposal(data, thunkAPI);
  }
);

export const proposalAdd = createAsyncThunk(
  "/proposal/add",
  async (data, thunkAPI) => {
    return await proposalServices.proposalAdd(data, thunkAPI);
  }
);

export const proposalEdit = createAsyncThunk(
  "/proposal/edit/:proposal_id",
  async ({ proposal_id, data }, thunkAPI) => {
    return await proposalServices.proposalEdit(proposal_id, data, thunkAPI);
  }
);

export const proposalDelete = createAsyncThunk(
  "proposal/delete",
  async (proposal_id, thunkAPI) => {
    try {
      const response = await proposalServices.proposalDelete(proposal_id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getAllProposals = createAsyncThunk("/proposal/all", async () => {
  return await proposalServices.getAllProposals();
});

export const getProposalDetail = createAsyncThunk(
  "/proposal/:proposal_id/detail",
  async (proposal_id, thunkAPI) => {
    return await proposalServices.getProposalDetail(proposal_id, thunkAPI);
  }
);

export const getProposalStatus = createAsyncThunk(
  "/proposal/:proposal_id/status",
  async (proposal_id, thunkAPI) => {
    return await proposalServices.getProposalStatus(proposal_id, thunkAPI);
  }
);

export const editProposalStatus = createAsyncThunk(
  "/proposal/:proposal_id/status/edit",
  async ({ proposal_id, data }, thunkAPI) => {
    return await proposalServices.editProposalStatus(
      proposal_id,
      data,
      thunkAPI
    );
  }
);

export const getProposalComments = createAsyncThunk(
  "/proposal/:proposal_id/comments",
  async (proposal_id, thunkAPI) => {
    return await proposalServices.getProposalComments(proposal_id, thunkAPI);
  }
);

export const searchProposals = createAsyncThunk(
  "/proposal/search",
  async (keywords, thunkAPI) => {
    return await proposalServices.searchProposals(keywords, thunkAPI);
  }
);

export const getProposalSponsors = createAsyncThunk(
  "/proposal/:proposal_id/sponsors",
  async (proposal_id, thunkAPI) => {
    return await proposalServices.getProposalSponsors(proposal_id, thunkAPI);
  }
);

export const getUserProposals = createAsyncThunk(
  "/get_proposal_record/:user_id",
  async (user_id, thunkAPI) => {
    return await proposalServices.getUserProposals(user_id, thunkAPI);
  }
);

// Initial state
const initialState = {
  proposals: [],
  proposalDetail: null,
  proposalStatus: null,
  proposalComments: [],
  proposalSponsors: [],
  searchResults: [],
  userProposal: [],
  isLoading: false,
  error: null, // 可選的錯誤訊息狀態
};

// Create the proposalSlice with builder callback notation
const proposalSlice = createSlice({
  name: "proposals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle proposalAdd
      .addCase(proposalAdd.fulfilled, (state, action) => {
        state.proposals.push(action.payload);
        state.isLoading = false;
      })
      .addCase(proposalAdd.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(proposalAdd.rejected, (state) => {
        state.isLoading = false;
      })

      // Handle proposalEdit
      .addCase(proposalEdit.fulfilled, (state, action) => {
        const index = state.proposals.findIndex(
          (proposal) => proposal.id === action.payload.id
        );
        if (index >= 0) {
          state.proposals[index] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(proposalEdit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(proposalEdit.rejected, (state) => {
        state.isLoading = false;
      })

      // Handle proposalDelete
      .addCase(proposalDelete.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(proposalDelete.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(proposalDelete.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      // Handle getAllProposals
      .addCase(getAllProposals.fulfilled, (state, action) => {
        state.proposals = action.payload; // 更新提案列表
        state.isLoading = false;
      })
      .addCase(getAllProposals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProposals.rejected, (state) => {
        state.isLoading = false;
        state.proposals = [];
      })

      // Handle getProposalDetail
      .addCase(getProposalDetail.fulfilled, (state, action) => {
        state.proposalDetail = action.payload;
        state.isLoading = false;
      })
      .addCase(getProposalDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProposalDetail.rejected, (state) => {
        state.isLoading = false;
        state.proposalDetail = null;
      })

      // Handle getProposalStatus
      .addCase(getProposalStatus.fulfilled, (state, action) => {
        state.proposalStatus = action.payload;
        state.isLoading = false;
      })
      .addCase(getProposalStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProposalStatus.rejected, (state) => {
        state.isLoading = false;
        state.proposalStatus = null;
      })

      // Handle editProposalStatus
      .addCase(editProposalStatus.fulfilled, (state, action) => {
        state.proposalStatus = action.payload;
        state.isLoading = false;
      })
      .addCase(editProposalStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editProposalStatus.rejected, (state) => {
        state.isLoading = false;
      })

      // Handle getProposalComments
      .addCase(getProposalComments.fulfilled, (state, action) => {
        state.proposalComments = action.payload;
        state.isLoading = false;
      })
      .addCase(getProposalComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProposalComments.rejected, (state) => {
        state.isLoading = false;
        state.proposalComments = [];
      })

      // Handle searchProposals
      .addCase(searchProposals.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.isLoading = false;
      })
      .addCase(searchProposals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProposals.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
      })

      // Handle getProposalSponsors
      .addCase(getProposalSponsors.fulfilled, (state, action) => {
        state.proposalSponsors = action.payload;
        state.isLoading = false;
      })
      .addCase(getProposalSponsors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProposalSponsors.rejected, (state) => {
        state.isLoading = false;
        state.proposalSponsors = [];
      })
      // Handle getUserProposals
      .addCase(getUserProposals.fulfilled, (state, action) => {
        state.userProposal = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserProposals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserProposals.rejected, (state) => {
        state.isLoading = false;
        state.userProposal = [];
      })

      // Handle purchaseProposal
      .addCase(purchaseProposal.fulfilled, (state, action) => {
        // 購買成功後，假設返回的資料會更新提案狀態或提案列表
        // const purchasedProposal = action.payload;
        // state.proposals = state.proposals.map((proposal) =>
        //   proposal._id === purchasedProposal._id ? purchasedProposal : proposal
        // );
        state.purchasedProposal = action.payload.user.purchases_record;
        state.isLoading = false;
      })
      .addCase(purchaseProposal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(purchaseProposal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message; // 儲存錯誤訊息
      });
  },
});

export default proposalSlice.reducer;
