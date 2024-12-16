const app = require("../index");
const Proposal = require("../model/proposal-model");
const User = require("../model/user-model");
const mongoose = require("mongoose");
const supertest = require("supertest");

// At the beginning of your test file, set the environment to 'test'
process.env.NODE_ENV = "test";

// Load environment variables
require("dotenv").config();

// Shared test data
let proposalData;
let proposalId;
let userData;
let userId;

// Helper function to create a proposal
const createProposal = async (overrides = {}) => {
  const defaultData = {
    _id: new mongoose.Types.ObjectId(),
    proposal_id: 1,
    title: "Test Proposal",
    description: "Test Description",
    funding_goal: 1000,
    start_date: new Date(),
    end_date: new Date(),
    status: 0,
    category: "Test",
    establish_user_id: 1,
    current_total_amount: 500,
    funding_reached: false,
  };
  const data = { ...defaultData, ...overrides };
  return await Proposal.create(data);
};

// Helper function to create a user
const createUser = async (overrides = {}) => {
  const defaultData = {
    _id: new mongoose.Types.ObjectId(),
    user_id: 1,
    username: "TestUser",
    email: "testuser@example.com",
    password: "Basic",
    purchases_record: [],
  };
  const data = { ...defaultData, ...overrides };
  return await User.create(data);
};

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    // Connect to the test database
    await connectDB();
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Proposal.deleteMany({});
  await User.deleteMany({});
  proposalData = await createProposal();
  proposalId = proposalData.proposal_id;
  userData = await createUser();
  userId = userData.user_id;
});

describe("Proposal API Tests", () => {
  // 取得提案資料 - 成功
  test("POST /proposal_add", async () => {
    const data = {
      title: "Proposal 1",
      description: "Description of proposal 1",
      funding_goal: 10000,
      start_date: new Date(),
      end_date: new Date(),
      category: "Technology",
      establish_user_id: 60,
      cover_image: "https://example.com/image3.png",
    };

    await supertest(app)
      .post("/api/proposal_add")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(data)
      .expect(201)
      .then(async (response) => {
        expect(response.body._id).toBeTruthy();
        expect(response.body.title).toBe(data.title);
        expect(response.body.description).toBe(data.description);

        const proposal = await Proposal.findOne({ _id: response.body._id });
        expect(proposal).toBeTruthy();
        expect(proposal.title).toBe(data.title);
        expect(proposal.description).toBe(data.description);
      });
  });
  // 取得提案資料 - 缺少必要欄位
  test("POST /proposal_add should return 400 if missing required fields", async () => {
    await supertest(app)
      .post("/api/proposal_add")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({ title: "Missing Fields" })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("All fields are required");
      });
  });

  // 編輯提案資料 - 成功
  test("PUT /proposal_edit/:proposal_id", async () => {
    const updatedData = {
      _id: new mongoose.Types.ObjectId(),
      proposal_id: proposalId,
      title: "Updated Proposal",
      description: "Updated Description",
      funding_goal: 2000,
      start_date: new Date(),
      end_date: new Date(),
      status: 1,
      category: "Updated Category",
      establish_user_id: 2,
      current_total_amount: 1000,
      funding_reached: true,
    };

    await supertest(app)
      .put(`/api/proposal_edit/${proposalId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(updatedData)
      .expect(200)
      .then(async (response) => {
        expect(response.body.proposal_id).toBe(proposalId);
        expect(response.body.title).toBe(updatedData.title);
        expect(response.body.funding_goal).toBe(updatedData.funding_goal);

        const updatedProposal = await Proposal.findOne({
          proposal_id: proposalId,
        });
        expect(updatedProposal).toBeTruthy();
        expect(updatedProposal.title).toBe(updatedData.title);
        expect(updatedProposal.description).toBe(updatedData.description);
      });
  });
  // 編輯提案資料 - ID無效
  test("PUT /proposal_edit/:proposal_id should return 404 if proposal not found", async () => {
    await supertest(app)
      .put("/api/proposal_edit/999")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({ title: "Nonexistent Proposal" })
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Proposal not found");
      });
  });

  // 刪除提案資料 - 成功
  test("DELETE /proposal_delete/:proposal_id", async () => {
    await supertest(app)
      .delete(`/api/proposal_delete/${proposalId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body.message).toBe("Proposal deleted successfully");

        const deletedProposal = await Proposal.findOne({
          proposal_id: proposalId,
        });
        expect(deletedProposal).toBeNull();
      });
  });
  // 刪除提案資料 - ID無效
  test("DELETE /proposal_delete/:proposal_id should return 404 if proposal not found", async () => {
    await supertest(app)
      .delete("/api/proposal_delete/999")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Proposal not found");
      });
  });

  // 取得所有提案資料 - 成功
  test("GET /get_all_proposal", async () => {
    const proposals = await createProposal({
      proposal_id: 2,
      title: "Proposal 2",
    });

    await supertest(app)
      .get("/api/get_all_proposal")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(2);
        expect(response.body[0].title).toBe("Test Proposal");
        expect(response.body[1].title).toBe("Proposal 2");
      });
  });

  // 取得提案詳細資料 - 成功
  test("GET /get_proposal_detail/:proposal_id", async () => {
    await supertest(app)
      .get(`/api/get_proposal_detail/${proposalId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.title).toBe(proposalData.title);
        expect(response.body.description).toBe(proposalData.description);
        expect(response.body.funding_goal).toBe(proposalData.funding_goal);
        expect(response.body.status).toBe(proposalData.status);
        expect(response.body.proposal_id).toBe(proposalData.proposal_id);
        expect(response.body.establish_user_id).toBe(
          proposalData.establish_user_id
        );
        expect(response.body.category).toBe(proposalData.category);
      });
  });

  // 取得提案詳細資料 - ID無效
  test("GET /get_proposal_detail/:proposal_id should return 400 for invalid proposal_id", async () => {
    await supertest(app)
      .get("/api/get_proposal_detail/invalid_id")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          "Invalid proposal_id, must be a number"
        );
      });
  });

  // 取得提案詳細資料 - 不存在
  test("GET /get_proposal_detail/:proposal_id should return 404 if proposal not found", async () => {
    await supertest(app)
      .get("/api/get_proposal_detail/999")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Proposal not found");
      });
  });

  // 搜尋提案 - 按標題
  test("GET /search_proposal?title=Test Proposal", async () => {
    await supertest(app)
      .get(`/api/search_proposal?title=Test Proposal`)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe("Proposals retrieved successfully");
        expect(response.body.proposals.length).toBeGreaterThan(0);
        expect(response.body.proposals[0].title).toBe(proposalData.title);
      });
  });
  // 搜尋提案 - 按分類
  test("GET /search_proposal?category=Test", async () => {
    await supertest(app)
      .get(`/api/search_proposal?category=Test`)
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe("Proposals retrieved successfully");
        expect(response.body.proposals.length).toBeGreaterThan(0);
        expect(response.body.proposals[0].category).toBe(proposalData.category);
      });
  });
  // 搜尋提案 - 無搜尋結果
  test("GET /search_proposal should return 404 when no proposals match search criteria", async () => {
    await supertest(app)
      .get(`/api/search_proposal?title=Nonexistent Title`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          "No proposals found matching your search criteria"
        );
      });
  });

  //購買提案 - 成功
  test("PUT /purchase_proposal", async () => {
    const purchaseData = {
      user_id: userId,
      proposal_id: proposalId,
      proposal_amount: 100,
    };

    await supertest(app)
      .put("/api/purchase_proposal")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(purchaseData)
      .expect(200)
      .then(async (response) => {
        expect(response.body.message).toBe("Purchase successful");

        // Check if the user's purchases record has been updated
        const updatedProposal = await Proposal.findOne({
          proposal_id: proposalId,
        });
        expect(updatedProposal.current_total_amount).toBe(600);
      });
  });
  // 購買提案 - 必填字段缺失
  test("PUT /purchase_proposal - missing required fields", async () => {
    const purchaseData = {
      user_id: userId,
      proposal_amount: 200,
    };

    await supertest(app)
      .put("/api/purchase_proposal")
      .send(purchaseData)
      .expect(400)
      .then((response) => {
        expect(response.text).toBe(
          "User ID, proposal amount, and proposal ID are required"
        );
      });
  });

  // 購買提案 - 提案ID無效
  test("PUT /purchase_proposal should return 404 if proposal not found", async () => {
    await supertest(app)
      .put("/api/purchase_proposal")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({ user_id: 1, proposal_id: 999, proposal_amount: 100 })
      .expect(404)
      .then((response) => {
        expect(response.text).toBe("Proposal not found");
      });
  });

  // 獲取贊助歷史 - 成功
  test("GET /user_get_sponsor_history/:user_id ", async () => {
    // Add a purchase record to the user
    userData.purchases_record.push({
      proposal_id: proposalId,
      proposal_title: proposalData.title,
      purchase_date: new Date(),
      purchase_money: 100,
    });
    await userData.save();

    await supertest(app)
      .get(`/api/user_get_sponsor_history/${userId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeTruthy();
        expect(response.body.purchases_record).toHaveLength(1);
        expect(response.body.purchases_record[0].proposal_id).toBe(proposalId);
      });
  });

  // 退款提案 - 成功
  test("DELETE /remove_purchase/:user_id/:proposal_id ", async () => {
    // Add a purchase record to the user
    userData.purchases_record.push({
      proposal_id: proposalId,
      proposal_title: proposalData.title,
      purchase_date: new Date(),
      purchase_money: 100,
    });
    await userData.save();

    await supertest(app)
      .delete(`/api/remove_purchase/${userId}/${proposalId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body.message).toBe(
          "Purchase record removed successfully"
        );
        expect(response.body.user.purchases_record).toHaveLength(0);

        const updatedUser = await User.findOne({ user_id: userId });
        expect(updatedUser.purchases_record).toHaveLength(0);
      });
  });

  // 退款提案 - 用戶未找到
  test("DELETE /remove_purchase/:user_id/:proposal_id - User not found", async () => {
    const nonExistingUserId = 9999;

    await supertest(app)
      .delete(`/api/remove_purchase/${nonExistingUserId}/${proposalId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe(
          "User not found or no matching record"
        );
      });
  });
});
