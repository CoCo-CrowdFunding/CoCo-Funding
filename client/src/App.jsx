import React from "react";
import { Route, Routes } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from "react-toastify";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Register from "./pages/Register";
import EditProfile from "./pages/EditProfile";
import AllProposalpage from "./pages/AllProposalpage";
import ProposalInfo from "./pages/ProposalInfopage";
import CreateProposal from "./pages/CreateProposal";
import EditProposal from "./pages/EditProposal";
import PaymentPage from "./pages/PaymentPage";
import ProposalTable from "./components/UserInfopage/ProposalTable";
import FundingRecordTable from "./components/UserInfopage/FundingRecordTable";
import AdminReviewPage from "./pages/AdminReviewPage";
import AdminRegister from "./pages/AdminRegister";

const App = () => {
  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={1000}
        limit={3}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/user/login" element={<Login />} /> {/* 新增 Login 路由 */}
        <Route path="/user/register" element={<Register />} />
        {/* 新增 Register 路由 */}
        <Route exact path="/user/profile" element={<EditProfile />} />
        {/* 新增 EditProfile 路由 */}
        <Route path="/all-proposals" element={<AllProposalpage />} />
        {/* 新增 AllProposalpage 路由 */}
        <Route path="/proposal/:id" element={<ProposalInfo />} />
        {/* 新增 ProposalInfo 路由 */}
        <Route path="/create-proposal" element={<CreateProposal />} />
        {/* 新增 CreateProposalpage 路由 */}
        <Route path="/edit-proposal/:id" element={<EditProposal />} />
        {/* 新增 EditProposalpage 路由 */}
        <Route path="/payment/:id" element={<PaymentPage />} />
        {/* 新增 payment 路由 */}
        <Route path="/user/info/proposal-record" element={<ProposalTable />} />
        {/* 新增 ProposalTable 路由 */}
        <Route
          path="/user/info/proposal-funding-record"
          element={<FundingRecordTable />}
        />
        <Route path="/admin/review" element={<AdminReviewPage />} />
        {/* 新增 AdminReviewPage 路由 */}
        <Route path="/admin/login" element={<AdminLogin />} /> {/* 新增 AdminLogin 路由 */}
        <Route path="/admin/register" element={<AdminRegister />} /> {/* 新增 AdminRegister 路由 */}

      </Routes>

      <Footer />
    </div>
  );
};

export default App;
