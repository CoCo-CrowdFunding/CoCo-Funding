const app = require("../index");
const mongoose = require("mongoose");
const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const fetch = require("node-fetch");

jest.mock("node-fetch");
const { Response } = jest.requireActual("node-fetch");

// At the beginning of your test file, set the environment to 'test'
process.env.NODE_ENV = "test";

// Load environment variables
require("dotenv").config();

// Helper function to create mock proposals in the database
const createProposal = async (overrides = {}) => {
  const defaultData = {
    title: "Test Proposal",
    description: "This is a test proposal description.",
    category: "tech",
  };
  const data = { ...defaultData, ...overrides };
  return await mongoose.model("Proposal").create(data);
};

// Setup in-memory database
let mongoServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Close any existing mongoose connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  jest.setTimeout(10000); // Increase timeout to 10 seconds
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clean up the database before each test
  await mongoose.model("Proposal").deleteMany({});
});

// Mocking API responses
const mockHFResponse = {
  inputs: "user query",
  sentences: ["Proposal 1 Description 1 tech", "Proposal 2 Description 2 tech"],
};

const mockGeminiResponse = {
  candidates: [
    {
      content: {
        parts: [
          {
            text: "Recommended proposal: Proposal 1: Description 1",
          },
        ],
      },
    },
  ],
};

describe("Chatbot API", () => {
  // Successful recommendation
  test("POST /recommend - Successful recommendation", async () => {
    const mockProposals = [
      {
        _id: new mongoose.Types.ObjectId(),
        proposal_id: 2,
        title: "tech Proposal2",
        description: "tech Description2",
        funding_goal: 1000,
        start_date: new Date(),
        end_date: new Date(),
        status: 0,
        category: "tech",
        establish_user_id: 1,
        current_total_amount: 200,
        funding_reached: false,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        proposal_id: 1,
        title: "tech Proposal8",
        description: "tech Description999",
        funding_goal: 1000,
        start_date: new Date(),
        end_date: new Date(),
        status: 0,
        category: "tech",
        establish_user_id: 1,
        current_total_amount: 500,
        funding_reached: false,
      },
    ];
    await createProposal(mockProposals[0]);
    await createProposal(mockProposals[1]);

    fetch.mockImplementation((url) => {
      if (url.includes("huggingface")) {
        return Promise.resolve(new Response(JSON.stringify(mockHFResponse)));
      }
      if (url.includes("googleapis")) {
        return Promise.resolve(
          new Response(JSON.stringify(mockGeminiResponse))
        );
      }
      return Promise.reject(new Error("Invalid URL"));
    });

    const response = await supertest(app)
      .post("/recommend")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        user_query: "tech",
        category: "tech",
      })
      .expect(200);

    expect(response.body).toHaveProperty("response");
    // expect(response.body.response).toContain(
    //   "Recommended proposal: Proposal 1: Description 1"
    // );
  });

  // No proposals found
  test("POST /recommend - No proposals found", async () => {
    fetch.mockImplementation((url) => {
      if (url.includes("huggingface")) {
        return Promise.resolve(new Response(JSON.stringify(mockHFResponse)));
      }
      if (url.includes("googleapis")) {
        return Promise.resolve(
          new Response(JSON.stringify({ candidates: [] }))
        );
      }
      return Promise.reject(new Error("Invalid URL"));
    });

    const response = await supertest(app)
      .post("/recommend")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({
        user_query: "user query",
      })
      .expect(404);
  });
});
