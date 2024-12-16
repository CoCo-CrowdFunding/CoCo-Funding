import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import proposalReducer from "./features/proposal/proposalSlice";
import commentReducer from "./features/comment/commentSlice";
import chatbotReducer from "./features/chatbot/chatbotSlice";
import adminReducer from "./features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    proposal: proposalReducer,
    comment: commentReducer,
    chatbot: chatbotReducer,
    admin: adminReducer,
  },
});

export default store;
