//多名使用者同時修改自己的資訊(password&username etc)
import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '3s', target: 10 }, // Ramp up to 10 virtual users in 3 seconds
        { duration: '3s', target: 10 },  // Maintain 10 virtual users for 3 seconds
        { duration: '3s', target: 0 },   // Scale down to 0 virtual users in 3 seconds
    ],
};

let token; // 用來儲存 JWT Token
let userId; // 用來儲存使用者 ID

export default function () {
    let randomUserId = Math.floor(Math.random() * 1000) + 1000; // 隨機生成用戶 ID
    let newUsername = `updated_user${randomUserId}`;
    let newPassword = `newpassword${randomUserId}`;

    group('Authenticate: Login to Get Token', () => {
        const loginPayload = JSON.stringify({
            username: `user${randomUserId}`,
            email: `user${randomUserId}@gmail.com`,
            password: 'password123',
        });

        const loginHeaders = { 'Content-Type': 'application/json' };

        let loginRes = http.post('http://localhost:8080/api/user_login', loginPayload, { headers: loginHeaders });

        check(loginRes, {
            'POST /api/user_login status was 200': (r) => r.status === 200,
            'Token received': (r) => {
                const responseBody = JSON.parse(r.body);
                return responseBody.token !== undefined;
            },
        });

        if (loginRes.status === 200) {
            const responseBody = JSON.parse(loginRes.body);
            token = responseBody.token; // 儲存 token
            userId = responseBody.user_id; // 獲取用戶 ID
        } else {
            console.error('Failed to authenticate and retrieve token:', loginRes.body);
        }
    });

    if (!token || !userId) {
        console.error('No token or user ID available for further tests.');
        return;
    }

    // 更新使用者資訊
    group('PUT: Update user information', () => {
        const updatePayload = JSON.stringify({
            username: newUsername,
            password: newPassword,
        });

        const updateHeaders = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        let updateRes = http.put(`http://localhost:8080/api/user_edit/${userId}`, updatePayload, { headers: updateHeaders });

        check(updateRes, {
            'PUT /api/user_edit status was 200': (r) => r.status === 200,
            'User updated successfully': (r) => {
                const responseBody = JSON.parse(r.body);
                return responseBody.username === newUsername;
            },
        });

        // 印出結果以供檢查
        console.log('Update Response Body:', updateRes.body);
    });

    sleep(1); // 模擬操作延遲
}
