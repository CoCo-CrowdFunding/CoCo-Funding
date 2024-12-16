const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../index"); // Assuming your Express app is exported from this file
const Proposal = require("../model/proposal-model"); // The Proposal model
const Comment = require("../model/comment-model"); // The Comment model

// At the beginning of your test file, set the environment to 'test'
process.env.NODE_ENV = "test";

// Load environment variables
require("dotenv").config();

// Shared test data
let proposalData;
let proposalId;
let userId = 1; // Use a mock user ID for the test

// Helper function to create a proposal
const createProposal = async (overrides = {}) => {
  const defaultData = {
    _id: new mongoose.Types.ObjectId(),
    proposal_id: 2,
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
    comments: [],
  };

  const data = { ...defaultData, ...overrides };
  return await Proposal.create(data);
};

// Helper function to clear the database
const clearDatabase = async () => {
  await Proposal.deleteMany({});
  await Comment.deleteMany({});
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
  await clearDatabase();
  proposalData = await createProposal();
  proposalId = proposalData.proposal_id;
});

describe("Comment API Tests", () => {
  let commentId;
  let newComment;

  beforeEach(async () => {
    // Create a new comment
    newComment = {
      proposal_id: proposalId,
      user_id: 12,
      comment: "This is a test comment.",
      created: new Date(),
      rate: 4,
    };

    // Add the comment to the proposal
    const response = await supertest(app)
      .post("/api/comment_add")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(newComment);

    // Capture the commentId from the response
    commentId = response.body.proposal.comments[0].comment_id;
  });

  //新增評論成功
  test("POST /comment_add", async () => {
    const newComment = {
      proposal_id: proposalId,
      user_id: 11,
      comment: "這個提案真的很有創意，期待看到實現。",
      created: new Date(),
      rate: 5,
    };

    await supertest(app)
      .post("/api/comment_add")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`) // Use process.env.TEST_TOKEN for the test token
      .send(newComment)
      .expect(201)
      .then(async (response) => {
        expect(response.body.message).toBe(
          "Comment and rate successfully added."
        );
        expect(response.body.proposal.comments.length).toBeGreaterThan(0); // Ensure the comment was added

        // Retrieve the updated proposal to verify the comment was saved
        const proposal = await Proposal.findOne({ proposal_id: 2 }); // Assuming proposal_id is used to find proposals
        expect(proposal).toBeTruthy();
        expect(newComment).toBeTruthy();
      });
  });
  //新增評論失敗 - 缺少必要欄位
  test("POST /comment_add should return an error if required fields are missing", async () => {
    const data = {
      proposal_id: proposalId,
      user_id: userId,
      rate: 4,
      created: new Date(),
    }; // Missing comment field

    await supertest(app)
      .post("/api/comment_add")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(data)
      .expect(400)
      .then(async (response) => {
        expect(response.body.message).toBe(
          "All fields are required, including rate."
        );
      });
  });
  //新增評論失敗 - 評分超出範圍
  test("POST /comment_add should return an error if rate is out of range", async () => {
    const data = {
      proposal_id: proposalId,
      user_id: userId,
      rate: 6, // Invalid rate
      comment: "This is a comment.",
      created: new Date(),
    };

    await supertest(app)
      .post("/api/comment_add")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(data)
      .expect(400)
      .then(async (response) => {
        expect(response.body.message).toBe("Rate must be between 1 and 5.");
      });
  });
  //新增評論失敗 - 使用者已經評論過這個提案
  test("POST /comment_add should return an error if the user has already commented on this proposal", async () => {
    const firstCommentData = {
      proposal_id: proposalId,
      user_id: userId,
      rate: 5,
      comment: "Excellent!",
      created: new Date(),
    };

    // First, add a comment
    await supertest(app)
      .post("/api/comment_add")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(firstCommentData);

    const secondCommentData = {
      proposal_id: proposalId,
      user_id: userId,
      rate: 3,
      comment: "Good proposal.",
      created: new Date(),
    };

    // Attempt to add another comment by the same user
    await supertest(app)
      .post("/api/comment_add")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(secondCommentData)
      .expect(400)
      .then(async (response) => {
        expect(response.body.message).toBe(
          "User has already commented on this proposal."
        );
      });
  });
  //新增評論失敗 - 提案不存在
  test("POST /comment_add should return an error if the proposal does not exist", async () => {
    const nonExistingProposalId = 999; // Assume this ID doesn't exist in the DB

    const data = {
      proposal_id: nonExistingProposalId,
      user_id: userId,
      rate: 4,
      comment: "Good proposal.",
      created: new Date(),
    };

    await supertest(app)
      .post("/api/comment_add")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(data)
      .expect(404)
      .then(async (response) => {
        expect(response.body.message).toBe("Proposal not found.");
      });
  });

  // 刪除評論成功
  test("DELETE /comment_delete/:comment_id - should delete a comment successfully", async () => {
    const response = await supertest(app)
      .delete(`/api/comment_delete/${commentId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(200);

    expect(response.body.message).toBe("Comment successfully deleted.");
    expect(response.body.proposal.comments).not.toContainEqual(
      expect.objectContaining({ comment_id: commentId })
    );
  });

  // 刪除評論失敗 - 評論ID不存在
  test("DELETE /comment_delete/:comment_id - should return error if comment does not exist", async () => {
    const nonExistingCommentId = "nonExistingId"; // Use a mock non-existing comment ID
    const response = await supertest(app)
      .delete(`/api/comment_delete/${nonExistingCommentId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(404);

    expect(response.body.message).toBe("Comment not found.");
  });

  // 取得所有評論成功
  test("should return all comments for a proposal", async () => {
    const response = await supertest(app)
      .get(`/api/get_all_comment/${proposalId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].comment).toBe("This is a test comment.");
  });

  // 取得所有評論失敗 - 提案不存在
  test("should return 404 if proposal is not found", async () => {
    const nonExistingProposalId = 999; // Use a mock non-existing proposal ID

    const response = await supertest(app)
      .get(`/api/get_all_comment/${nonExistingProposalId}`)
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(404);

    expect(response.body.message).toBe("Proposal not found");
  });
});
