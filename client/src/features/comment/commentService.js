import { toast } from "react-toastify";
import * as api from "../api";

// 新增留言
const commentAdd = async (data, thunkAPI) => {
  try {
    const response = await api.commentAdd(data);

    if (!response.data) {
      console.log("No data returned from commentAdd API call.");
      return;
    }

    console.log("Add comment response:", response.data);
    toast.success("留言新增成功！", {
      toastId: "commentAddSuccess",
      theme: "colored",
    });

    return response.data;
  } catch (error) {
    // 是否重複評論
    if (
      error.response?.status === 400 &&
      error.response?.data?.message ===
        "User has already commented on this proposal."
    ) {
      toast.error("您已經評論過此提案", {
        toastId: "commentDuplicateError",
        theme: "colored",
      });
    } else {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      toast.error(message, {
        toastId: "commentAddError",
        theme: "colored",
      });
    }

    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
};

// 取得某個提案的所有留言
const getAllComment = async (proposal_id, thunkAPI) => {
  try {
    const response = await api.getAllComment(proposal_id);

    if (!response.data) {
      console.log("No data returned from getAllComment API call.");
      return;
    }

    console.log("Get all comments response:", response.data);
    return response.data;
  } catch (error) {
    console.log("取得評論失敗", error);
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
      toastId: "getAllCommentError",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

// 設置提案評分
const addRate = async (data, thunkAPI) => {
  try {
    const response = await api.addRate(data);

    if (!response.data) {
      console.log("No data returned from addRate API call.");
      return;
    }
    toast.success("評分新增成功！", {
      toastId: "addRateSuccess",
      theme: "colored",
    });
    console.log("Add rate response:", response.data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "addRateError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

// 查看提案的評分
const getRate = async (proposal_id, thunkAPI) => {
  try {
    const response = await api.getRate(proposal_id);

    if (!response.data) {
      console.log("No data returned from getRate API call.");
      return;
    }

    console.log("Get rate response:", response.data);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.err_msg) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "getRateError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

// 刪除留言
const deleteComment = async (comment_id, thunkAPI) => {
  try {
    const response = await api.deleteComment(comment_id);

    if (!response.data) {
      console.log("No data returned from deleteComment API call.");
      return;
    }

    toast.success("留言刪除成功！", {
      toastId: "deleteCommentSuccess",
      theme: "colored",
    });

    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    toast.error(message, {
      toastId: "deleteCommentError",
      theme: "colored",
    });

    return thunkAPI.rejectWithValue(message);
  }
};

export { commentAdd, getAllComment, addRate, getRate, deleteComment };
