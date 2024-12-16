const app = require("../index");
const Admin = require("../model/admin-model");
const User = require("../model/user-model");
const Proposal = require("../model/proposal-model");



const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { faker } = require('@faker-js/faker');


// Set the environment to 'test'
process.env.NODE_ENV = "test";

// Load environment variables
require("dotenv").config();

// Shared test data
let adminData;
let adminId;

// Helper function to create an admin
const createAdmin = async (overrides = {}) => {
    const defaultData = {
        _id: new mongoose.Types.ObjectId(),
        admin_id: 1,
        username: "Test Admin",
        password: "TestPassword123",
        email: "testadmin@example.com",
        created_at: new Date(),
    };
    const data = { ...defaultData, ...overrides };
    return await Admin.create(data);
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

// 隨機生成一個類別名稱
const generateRandomCategory = () => {
    return faker.commerce.department(); // 使用 faker 生成隨機商業類別，如 'Books', 'Electronics' 等
};
// 假資料生成工具
const generateFakeProposal = (num = 10) => {
    const proposals = [];
    for (let i = 0; i < num; i++) {
        proposals.push({
            _id: new mongoose.Types.ObjectId(),
            title: `Proposal ${i + 1}`,
            description: `Description for Proposal ${i + 1}`,
            status: Math.floor(Math.random() * 2), // 隨機狀態 0 或 1
            category: generateRandomCategory(), // 隨機類別
            funding_goal: 1000 + i * 100,
            start_date: new Date(),
            end_date: new Date(),
            establish_user_id: Math.floor(Math.random() * 6 + 1), // 隨機數字 1~5
            proposal_id: i + 1,
        });
    }
    return proposals;
};

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        // Connect to the test database
        await connectDB();
    }
});

afterAll(async () => {

    await Admin.deleteMany({});
    await User.deleteMany({});
    await Proposal.deleteMany({});
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});



beforeEach(async () => {
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Proposal.deleteMany({});
    adminData = await createAdmin();
    userData = await createUser();
    adminId = adminData.admin_id;
});


describe("Admin Register Tests", () => {
    // 新增管理員成功
    test("POST /admin_register", async () => {
        const data = {
            username: "newadmin",
            password: "newpassword",
            email: "newadmin@example.com",
        };

        console.log("TEST", data, process.env.TEST_TOKEN)
        await supertest(app)
            .post("/api/admin_register")
            .send(data)
            .expect(201)
            .then(async (response) => {
                // console.log("回傳", response.text);
                expect(response.text).toBe("Admin registered successfully");
            });


    });

    // 新增管理員時缺少必要欄位
    test("POST /admin_add should return 400 if missing required fields", async () => {
        await supertest(app)
            .post("/api/admin_register")
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .send({ username: "incompleteAdmin" })
            .expect(400)
            .then((response) => {
                expect(response.text).toBe("All fields are required:username, email, password");
            });
    });
});

describe("Admin Login Tests", () => {
    test("POST /admin_login - 成功登入並獲得令牌", async () => {
        // 為測試用的管理員密碼進行加密處理
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("TestPassword123", salt);

        // 更新測試用的管理員密碼
        await Admin.findByIdAndUpdate(adminData._id, { password: hashedPassword });

        const response = await supertest(app)
            .post("/api/admin_login")
            .send({
                username: "Test Admin",
                password: "TestPassword123",
            })
            .expect(200);

        // 檢查是否返回了 token
        expect(response.body.token).toBeDefined();

        // 檢查是否正確設置了 Authorization header
        const token = response.body.token;
        expect(response.headers.authorization).toBe(token);

        // 驗證 JWT 內容
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        expect(decoded.username).toBe("Test Admin");
        expect(decoded._id).toBe(adminData._id.toString());
    });

    test("POST /admin_login - 提供無效用戶名", async () => {
        const response = await supertest(app)
            .post("/api/admin_login")
            .send({
                username: "NonExistentUser",
                password: "TestPassword123",
            })
            .expect(400);

        // 驗證錯誤信息
        expect(response.text).toBe("Invalid username or password");
    });

    test("POST /admin_login - 提供無效密碼", async () => {
        const response = await supertest(app)
            .post("/api/admin_login")
            .send({
                username: "Test Admin",
                password: "WrongPassword123",
            })
            .expect(400);

        // 驗證錯誤信息
        expect(response.text).toBe("Invalid username or password");
    });

    test("POST /admin_login - 未提供用戶名或密碼", async () => {
        const response = await supertest(app)
            .post("/api/admin_login")
            .send({})
            .expect(400);

        // 驗證錯誤信息
        expect(response.text).toBe("Invalid username or password");
    });

});

describe("Admin Logout Tests", () => {
    test("POST /admin_logout - 成功登出", async () => {
        const response = await supertest(app)
            .post("/api/admin_logout") // 使用 GET 請求測試登出路由
            .set("Authorization", `Bearer testToken123`) // 設置模擬的 Authorization 標頭
            .expect(200); // 預期成功的 HTTP 狀態碼

        // 驗證響應的 Authorization 標頭是否已清除
        expect(response.headers.authorization).toBe("");
        // 驗證返回的響應內容
        expect(response.text).toBe("Admin logged out successfully");
    });
});

describe("Admin Edit Tests", () => {
    test("PUT /edit_admin_data - 成功修改用戶名和密碼", async () => {
        const newUsername = "updatedAdmin";
        const newPassword = "updatedPassword";

        const response = await supertest(app)
            .put("/api/edit_admin_data")
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .send({
                username: newUsername,
                password: newPassword,
            })
            .expect(200);

        // 驗證回應中的數據
        expect(response.body.username).toBe(newUsername);
        expect(response.body.password).not.toBe(newPassword); // 密碼應已加密

        // 驗證數據庫中的數據是否已更新
        const updatedAdmin = await Admin.findOne({});
        expect(updatedAdmin.username).toBe(newUsername);

        const isPasswordMatch = await bcrypt.compare(newPassword, updatedAdmin.password);
        expect(isPasswordMatch).toBe(true); // 驗證密碼是否更新正確
    });

    test("PUT /edit_admin_data - 缺少 username 或 password 時返回錯誤", async () => {
        const response = await supertest(app)
            .put("/api/edit_admin_data")
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .send({ username: "onlyUsername" }) // 缺少 password
            .expect(400);

        expect(response.text).toBe("Invalid username or password");
    });
});

describe("Admin Delete_user Tests", () => {
    test("DELETE /admin_delete_user/:id - 成功刪除用戶", async () => {
        // 創建測試用戶
        const user = await User.create({
            username: "DeleteTestUser",
            password: "DeleteTestPassword123",
            email: "deletetestuser@example.com",
            user_id: 1,
            created_at: new Date(),
        });

        const response = await supertest(app)
            .delete(`/api/admin_delete_user/${user._id}`) // 發送 DELETE 請求
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .expect(200); // 預期返回成功的狀態碼

        // 驗證返回內容
        expect(response.text).toBe("User deleted successfully");

        // 驗證用戶是否已被刪除

        const deletedUser = await Admin.findById(user._id);
        expect(deletedUser).toBeNull(); // 確保該用戶已被刪除
    });

    test("DELETE /admin_delete_user/:id - 刪除不存在的用戶", async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // 使用不存在的 ID

        const response = await supertest(app)
            .delete(`/api/admin_delete_user/${nonExistentId}`) // 發送請求
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .expect(404); // 預期返回 404

        expect(response.text).toBe("User not found");
    });

    test("DELETE /admin_delete_user/:id - 發生錯誤", async () => {
        const invalidId = "invalid-id"; // 使用無效 ID 格式

        const response = await supertest(app)
            .delete(`/api/admin_delete_user/${invalidId}`)
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .expect(500); // 預期返回 500

        expect(response.text).toContain("Error deleting user");
    });
});


describe("Admin Get_all_users Tests", () => {
    test("GET /admin_get_all_users - 成功獲取所有用戶", async () => {

        // 先清空用戶數據庫
        await User.deleteMany({});

        // 創建兩個用戶作為測試數據
        await User.create({
            username: "User1",
            password: "Password123",
            email: "user1@example.com",
            user_id: 1,
        });

        await User.create({
            username: "User2",
            password: "Password123",
            email: "user2@example.com",
            user_id: 2,
        });

        // 發送 GET 請求獲取所有用戶
        const response = await supertest(app)
            .get("/api/admin_get_all_users")
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .expect(200); // 預期返回狀態碼 200

        // 驗證返回的用戶數量
        expect(response.body.length).toBe(2); // 確保返回了兩個用戶
        expect(response.body[0].username).toBe("User1"); // 驗證第一個用戶名
        expect(response.body[1].username).toBe("User2"); // 驗證第二個用戶名
    });

    test("GET /admin_get_all_users - 沒有用戶時返回空數組", async () => {

        // 先清空用戶數據庫
        await User.deleteMany({});
        // 如果資料庫中沒有用戶，預期返回空數組
        const response = await supertest(app)
            .get("/api/admin_get_all_users")
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .expect(200); // 預期返回狀態碼 200

        expect(response.body.length).toBe(0); // 確保返回空數組
    });

    test("GET /admin_get_all_users - 查詢失敗", async () => {
        // 模擬資料庫錯誤
        jest.spyOn(User, "find").mockImplementationOnce(() => {
            throw new Error("Database error");
        });

        const response = await supertest(app)
            .get("/api/admin_get_all_users")
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .expect(500); // 預期返回狀態碼 500

        expect(response.text).toContain("Error retrieving users"); // 驗證錯誤信息
    });
});

describe("Admin Get All Proposals with Status 0 Tests", () => {

    test("GET /admin_proposals - 成功獲取所有狀態為 0 的提案", async () => {

        // 填充資料庫，這裡我們生成 20 條假資料
        const fakeProposals = generateFakeProposal(20);
        await Proposal.create(fakeProposals);

        // 發送 GET 請求獲取所有狀態為 0 的提案
        const response = await supertest(app)
            .get("/api/admin_proposals")
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .expect(200); // 預期返回狀態碼 200

        console.log("回傳", response.body);
        // 驗證返回的提案數量
        expect(response.body.length).toBeGreaterThan(0); // 確保返回至少有一個提案
        expect(response.body[0].status).toBe(0); // 驗證第一個提案的狀態為 0
    });

    test("GET /admin_proposals - 沒有狀態為 0 的提案時返回空數組", async () => {
        // 創建所有狀態為 1 的提案
        await Proposal.deleteMany({});
        const fakeProposals = generateFakeProposal(10).map(proposal => ({
            ...proposal,
            status: 1, // 設置為狀態 1
        }));
        await Proposal.create(fakeProposals);

        const response = await supertest(app)
            .get("/api/admin_proposals")
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .expect(200); // 預期返回狀態碼 200

        expect(response.body.length).toBe(0); // 確保返回空數組
    });

    test("GET /admin_proposals - 查詢失敗", async () => {
        // 模擬資料庫錯誤
        jest.spyOn(Proposal, "find").mockImplementationOnce(() => {
            throw new Error("Database error");
        });

        const response = await supertest(app)
            .get("/api/admin_proposals")
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .expect(500); // 預期返回狀態碼 500

        expect(response.text).toContain("Error retrieving proposals"); // 驗證錯誤信息
    });
});
describe("Admin Update_proposal_status Tests", () => {

    test("成功更新提案狀態", async () => {

        // 填充資料庫，這裡我們生成 20 條假資料
        const fakeProposals = generateFakeProposal(20);
        await Proposal.create(fakeProposals);

        // 這裡可以拿到資料庫中某一條提案，進行測試
        const proposal = await Proposal.findOne();
        const newStatus = 1;

        const response = await supertest(app)
            .put(`/api/update_proposal_status/${proposal._id}`)
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .send({ status: newStatus })
            .expect(200);

        expect(response.body.status).toBe(newStatus);
    });

    test("提供無效的 status 值", async () => {

        // 填充資料庫，這裡我們生成 20 條假資料
        const fakeProposals = generateFakeProposal(20);
        await Proposal.create(fakeProposals);

        const proposal = await Proposal.findOne();

        const response = await supertest(app)
            .put(`/api/update_proposal_status/${proposal._id}`)
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .send({ status: 3 }) // 無效的 status
            .expect(400);

        expect(response.text).toBe("Invalid status value. Must be 1 or 2.");
    });

    test("提案不存在", async () => {

        // 填充資料庫，這裡我們生成 20 條假資料
        const fakeProposals = generateFakeProposal(20);
        await Proposal.create(fakeProposals);

        const nonExistentProposalId = "507f1f77bcf86cd799439011"; // 假的提案 ID

        const response = await supertest(app)
            .put(`/api/update_proposal_status/${nonExistentProposalId}`)
            .set("Authorization", `Bearer ${process.env.TEST_TOKEN}`)
            .send({ status: 1 })
            .expect(404);

        expect(response.text).toBe("Proposal not found");
    });

});
