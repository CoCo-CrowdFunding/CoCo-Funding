import axios from "axios";
import { getUserFromLocalStorage, getAdminFromLocalStorage } from "../../utils/localStorage";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 20000,
});

API.interceptors.request.use(
  (config) => {
    const user = getUserFromLocalStorage();
    const admin = getAdminFromLocalStorage();

    if (user?.token) {
      config.headers.authorization = `Bearer ${user.token}`;
    } else if (admin?.token) {
      config.headers.authorization = `Bearer ${admin.token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Path: baseURL/auth/

// Path: baseURL/user/
// 用戶註冊
export const userRegister = (data) => API.post("/user_register", data);
// 用戶登入
export const userLogin = (data) => API.post("/user_login", data);
// 用戶登出
export const userLogout = () => API.post("/user_logout");
// 編輯用戶資料
export const userEdit = (user_id, data) =>
  API.put(`/user_edit/${user_id}`, data);
// 獲取用戶資料
export const userGet = (user_id) => API.get(`/user_get/${user_id}`);
// 更新用戶密碼
export const userEditPwd = (user_id, data) =>
  API.put(`/user_edit_pwd/${user_id}`, data);
// 獲取用戶贊助歷史
export const userGetSponsorHistory = (user_id) =>
  API.get(`/user_get_sponsor_history/${user_id}`);
// 退款請求
export const refundProposal = (user_id, proposal_id) =>
  API.delete(`/remove_purchase/${user_id}/${proposal_id}`);

// Path: baseURL/proposal/
// 新增提案
export const proposalAdd = (data) => API.post("/proposal_add", data);
// 編輯提案
export const proposalEdit = (proposal_id, data) =>
  API.put(`/proposal_edit/${proposal_id}`, data);
// 刪除提案
export const proposalDelete = (proposal_id) =>
  API.delete(`/proposal_delete/${proposal_id}`);
// 獲取所有提案
export const getAllProposals = () => API.get("/get_all_proposal");
// 獲取提案詳情
export const getProposalDetail = (proposal_id) =>
  API.get(`/get_proposal_detail/${proposal_id}`);
// 獲取提案狀態
export const getProposalStatus = (proposal_id) =>
  API.get(`/get_status/${proposal_id}`);
// 編輯提案狀態
export const editProposalStatus = (proposal_id, data) =>
  API.put(`/edit_status/${proposal_id}`, data);
// 獲取提案評論
export const getProposalComments = (proposal_id) =>
  API.get(`/get_comments/${proposal_id}`);
// 搜索提案
export const searchProposals = (keywords) =>
  API.get(`/search_proposal`, { params: { keywords } });
// 獲取提案贊助者
export const getProposalSponsors = (proposal_id) =>
  API.get(`/get_proposal_sponsors/${proposal_id}`);
// 獲取用戶提案
export const getUserProposals = (user_id) =>
  API.get(`/get_proposal_record/${user_id}`);

//Path: baseURL/comment/

// 新增留言
export const commentAdd = (data) => API.post("/comment_add", data);
// 取得某個提案的所有留言
export const getAllComment = (proposal_id) =>
  API.get(`/get_all_comment/${proposal_id}`);
// 設置提案評分
export const addRate = (data) => API.post("/add_rate", data);
// 查看提案的評分
export const getRate = (proposal_id) => API.get(`/get_rate/${proposal_id}`);
// 刪除評論
export const deleteComment = (comment_id) =>
  API.delete(`/comment_delete/${comment_id}`);

//baseURL/chatbot/
export const recommendProposal = (data) => 
  API.post("/recommand", data);
// export const fetchManual = () => 
//   API.post("/manual");
// export const fetchProposalDetails = (data) => 
//   API.post("/proposal", data);
// Path: baseURL/payment/

// 購買提案
export const purchaseProposal = (data) => API.put("/purchase_proposal", data);

// Path: baseURL/admin/
// 管理員登入
export const adminLogin = (data) => API.post("/admin_login", data);

// 管理員登出
export const adminLogout = () => API.post("/admin_logout");

// 管理員取得所有狀態為 0 的提案
export const adminProposals = () => API.get("/admin_proposals");

// 管理者更新指定提案的狀態
export const updateProposalStatus = (proposal_id, status) => API.put(`/update_proposal_status/${proposal_id}`, { status });

// 管理員註冊
export const adminRegister = (data) => API.post("/admin_register", data);