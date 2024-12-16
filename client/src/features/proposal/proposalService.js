import { toast } from "react-toastify";
import * as api from "../api";

//新增提案
const proposalAdd = async (data, thunkAPI) => {
  try {
    const response = await api.proposalAdd(data);

    if (!response.data) {
      console.log("No data returned from proposalAdd API call.");
      return;
    }

    console.log("Add proposal response:", response.data);
    toast.success("提案新增成功！", {
      toastId: "proposalAddSuccess",
      theme: "colored",
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "proposalAddError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

const proposalEdit = async (proposal_id, data, thunkAPI) => {
  try {
    const response = await api.proposalEdit(proposal_id, data);

    if (!response.data) {
      console.log("No data returned from proposalEdit API call.");
      return;
    }

    console.log("Edit proposal response:", response.data);
    toast.success("提案編輯成功！", {
      toastId: "proposalEditSuccess",
      theme: "colored",
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "proposalEditError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

const proposalDelete = async (proposal_id, thunkAPI) => {
  try {
    console.log("proposal removed service", proposal_id);
    const response = await api.proposalDelete(proposal_id);

    if (!response.data) {
      console.log("No data returned from proposalDelete API call.");
      return;
    }

    console.log("Delete proposal response:", response.data);
    toast.success("提案刪除成功！", {
      toastId: "proposalDeleteSuccess",
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "proposalDeleteError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

const getAllProposals = async (thunkAPI) => {
  try {
    const response = await api.getAllProposals();

    if (!response.data) {
      console.log("No data returned from getAllProposals API call.");
      return;
    }
    console.log("Get all proposals response:", response.data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "getAllProposalsError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

const getProposalDetail = async (proposal_id, thunkAPI) => {
  try {
    const response = await api.getProposalDetail(proposal_id);

    if (!response.data) {
      console.log("No data returned from getProposalDetail API call.");
      return;
    }

    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "getProposalDetailError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

const getProposalStatus = async (proposal_id, thunkAPI) => {
  try {
    const response = await api.getProposalStatus(proposal_id);

    if (!response.data) {
      console.log("No data returned from getProposalStatus API call.");
      return;
    }

    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "getProposalStatusError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};
// 編輯提案狀態
const editProposalStatus = async (proposal_id, data, thunkAPI) => {
  try {
    const response = await api.editProposalStatus(proposal_id, data);

    if (!response.data) {
      console.log("No data returned from editProposalStatus API call.");
      return;
    }
    toast.success("提案狀態編輯成功！", {
      toastId: "editProposalStatusSuccess",
      theme: "colored",
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "editProposalStatusError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

const getProposalComments = async (proposal_id, thunkAPI) => {
  try {
    const response = await api.getProposalComments(proposal_id);

    if (!response.data) {
      console.log("No data returned from getProposalComments API call.");
      return;
    }

    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "getProposalCommentsError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

const searchProposals = async (keywords, thunkAPI) => {
  try {
    const response = await api.searchProposals(keywords);

    if (!response.data) {
      console.log("No data returned from searchProposals API call.");
      return;
    }

    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "searchProposalsError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

const getProposalSponsors = async (proposal_id, thunkAPI) => {
  try {
    const response = await api.getProposalSponsors(proposal_id);

    if (!response.data) {
      console.log("No data returned from getProposalSponsors API call.");
      return;
    }

    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "getProposalSponsorsError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

// 獲取用戶提案
export const getUserProposals = async (user_id, thunkAPI) => {
  try {
    const response = await api.getUserProposals(user_id);

    if (!response.data) {
      console.log("No data returned from getUserProposals API call.");
      return;
    }

    return response.data.data;
  } catch (error) {
    let message;

    if (error.response) {
      // 從 error.response.data 中獲取錯誤訊息
      message =
        error.response.data.message ||
        error.response.data.err_msg ||
        error.message;
    } else if (error.message) {
      // 如果沒有 error.response，但有 error.message
      message = error.message;
    } else {
      // 如果沒有 error.response 和 error.message，轉換 error 為字符串
      message = error.toString();
    }
    toast(message, {
      toastId: "getUserProposalsError",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

// 購買提案
export const purchaseProposal = async (data, thunkAPI) => {
  try {
    const response = await api.purchaseProposal(data);

    // 如果沒有返回有效數據，可以打印或處理錯誤
    if (!response.data) {
      console.log("No data returned from purchaseProposal API call.");
      return;
    }

    // 返回後端返回的數據
    return response.data;
  } catch (error) {
    // 處理錯誤
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    // 顯示錯誤訊息
    toast.error(message, {
      toastId: "purchaseProposalError",
      theme: "colored",
    });

    // 使用 thunkAPI.rejectWithValue 將錯誤傳回 Redux
    return thunkAPI.rejectWithValue(message);
  }
};

const proposalServices = {
  proposalAdd,
  proposalEdit,
  proposalDelete,
  getAllProposals,
  getProposalDetail,
  getProposalStatus,
  editProposalStatus,
  getProposalComments,
  searchProposals,
  getProposalSponsors,
  getUserProposals,
  purchaseProposal,
};

export default proposalServices;
