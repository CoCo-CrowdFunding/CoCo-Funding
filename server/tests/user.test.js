const app = require("../index");
const User = require("../model/user-model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");

// At the beginning of your test file, set the environment to 'test'
process.env.NODE_ENV = "test";

// Load environment variables
require("dotenv").config();

// Shared test data
let userData;
let userId;

// Helper function to create a user
const createUser = async (overrides = {}) => {
  const defaultData = {
    _id: new mongoose.Types.ObjectId(),
    user_id: 1,
    username: "TestUser",
    email: "testuser@example.com",
    password: "password123",
    purchases_record: [],
    present_record: [],
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
  await User.deleteMany({});
  userData = await createUser();
  userId = userData.user_id;
});

describe("User API", () => {
  // 用戶註冊 - 成功
  test("POST /user_register ", async () => {
    const newUser = {
      username: "NewUser",
      email: "newuser@example.com",
      password: "newpassword123",
    };

    await supertest(app)
      .post("/api/user_register")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(newUser)
      .expect(201)
      .then((response) => {
        expect(response.text).toBe("User registered successfully");
      });

    const createdUser = await User.findOne({ email: newUser.email });
    expect(createdUser).toBeTruthy();
    expect(createdUser.username).toBe(newUser.username);
  });
  // 用戶註冊 - 缺少必要欄位
  test("POST /user_register - Missing files", async () => {
    const newUser = {
      username: "NewUser",
      email: "newuser@example.com",
    };

    await supertest(app)
      .post("/api/user_register")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(newUser)
      .expect(400)
      .then((response) => {
        expect(response.text).toContain("All fields are required");
      });
  });

  // 登錄 - 成功
  test("POST /user_login - Successful login", async () => {
    const loginData = {
      email: userData.email,
      password: "password123",
    };

    await supertest(app)
      .post("/api/user_login")
      .send(loginData)
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("token");
        expect(response.body).toHaveProperty("user");
        expect(response.body.user.email).toBe(userData.email);
      });
  });
  // 登錄 - 無效憑據
  test("POST /user_login - Invalid credentials", async () => {
    const loginData = {
      email: userData.email,
      password: "wrongpassword",
    };

    await supertest(app)
      .post("/api/user_login")
      .send(loginData)
      .expect(400)
      .then((response) => {
        expect(response.text).toBe("Invalid username or password");
      });
  });
  // 登錄 - 用戶不存在
  test("POST /user_login - Non-existent user", async () => {
    const loginData = {
      email: "nonexistent@example.com",
      password: "password123",
    };

    await supertest(app)
      .post("/api/user_login")
      .send(loginData)
      .expect(400)
      .then((response) => {
        expect(response.text).toBe("no user found");
      });
  });

  // 用戶登出 - 成功
  test("POST /user_logout - Successful logout", async () => {
    await supertest(app)
      .post("/api/user_logout")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(200)
      .then((response) => {
        expect(response.text).toBe("User logged out successfully");
        expect(response.header).toHaveProperty("authorization", "");
      });
  });

  // 修改用戶信息 - 成功
  test("PUT /user_edit/:user_id ", async () => {
    const updatedData = {
      username: "updateduser",
      password: "newpassword123",
    };

    await supertest(app)
      .put("/api/user_edit/1")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(updatedData)
      .expect(200)
      .then(async (response) => {
        expect(response.body.username).toBe(updatedData.username);
        // Verify the password was updated and hashed
        const updatedUser = await User.findOne({ user_id: 1 });
        const isPasswordValid = await bcrypt.compare(
          updatedData.password,
          updatedUser.password
        );
        expect(isPasswordValid).toBe(true);
      });
  });
  // 修改用戶信息 - 用戶不存在
  test("PUT /user_edit/:user_id - User not found", async () => {
    const updatedData = {
      username: "nonexistentuser",
      password: "newpassword123",
    };

    await supertest(app)
      .put("/api/user_edit/999") // Non-existent user_id
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send(updatedData)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("User not found");
      });
  });

  // 取得用戶信息 - 成功
  test("GET /user_get/:user_id - Successful retrieval", async () => {
    await supertest(app)
      .get("/api/user_get/1")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(200)
      .then((response) => {
        expect(response.body.user_id).toBe(1);
        expect(response.body.username).toBe("TestUser");
        expect(response.body.email).toBe("testuser@example.com");
      });
  });
  // 取得用戶信息 - 用戶不存在
  test("GET /user_get/:user_id - User not found", async () => {
    await supertest(app)
      .get("/api/user_get/999") // Non-existent user_id
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("User not found");
      });
  });
  // 取得用戶信息 - 無效用戶 ID
  test("GET /user_get/:user_id - Invalid user_id", async () => {
    await supertest(app)
      .get("/api/user_get/invalid_id") // Invalid user_id
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid user_id, must be a number");
      });
  });

  // 修改密碼 - 成功
  test("PUT /user_edit_pwd/:user_id - Successful password update", async () => {
    const newPassword = "newpassword123";
    await supertest(app)
      .put("/api/user_edit_pwd/1")
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({ password: newPassword })
      .expect(200)
      .then(async (response) => {
        expect(response.body.user_id).toBe(1);
        const user = await User.findOne({ user_id: 1 }).select("+password");
        const isMatch = await bcrypt.compare(newPassword, user.password);
        expect(isMatch).toBe(true);
      });
  });
  // 修改密碼 - 用戶不存在
  test("PUT /user_edit_pwd/:user_id - User not found", async () => {
    await supertest(app)
      .put("/api/user_edit_pwd/999") // Non-existent user_id
      .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
      .send({ password: "newpassword123" })
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("User not found");
      });
  });
});
