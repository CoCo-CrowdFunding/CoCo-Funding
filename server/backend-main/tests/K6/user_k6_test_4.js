//多名使用者同時註冊+登入 
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
let userId; // 用來儲存使用者的 ID

export default function () {
    let randomUserId = Math.floor(Math.random() * 1000) + 1000; // 隨機生成使用者 ID
    let username = `user${randomUserId}`;
    let email = `user${randomUserId}@gmail.com`;
    let password = 'password123';

    // 註冊新使用者
    group('POST: Register new user', () => {
        const registrationPayload = JSON.stringify({
            username: username,
            email: email,
            password: password,
        });
        const registrationHeaders = { 'Content-Type': 'application/json' };

        let regRes = http.post('http://localhost:8080/api/user_register', registrationPayload, { headers: registrationHeaders });

        check(regRes, {
            'POST /api/user_register status was 200': (r) => r.status === 200,
            'User registered successfully': (r) => r.body.includes('User registered successfully'),
        });
    });

    // 註冊成功後立即登入
    group('POST: Login to get token', () => {
        const loginPayload = JSON.stringify({
            username: username,
            email: email,
            password: password,
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
            token = responseBody.token; // 儲存 token 用於後續請求
        } else {
            console.error('Failed to authenticate and retrieve token:', loginRes.body);
        }
    });

    sleep(1); // 模擬操作延遲
}
