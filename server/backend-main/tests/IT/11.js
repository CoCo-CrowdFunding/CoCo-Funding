import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '3s', target: 5 }, // Ramp-up to 5 users
        { duration: '5s', target: 5 }, // Stay at 5 users
        { duration: '3s', target: 0 }, // Ramp-down to 0 users
    ],
};

let token;
const userIdToDelete = 1; // Replace with the ID of a user you want to delete

export default function () {
    group('Authenticate: Admin Login to Get Token', () => {
        const authPayload = JSON.stringify({
            username: 'admin123',
            password: '123456789',
        });
        const headers = { 'Content-Type': 'application/json' };

        const authRes = http.post('http://localhost:8080/api/admin_login', authPayload, { headers });

        check(authRes, {
            'Login successful': (r) => r.status === 200,
            'Token received': (r) => JSON.parse(r.body).token !== undefined,
        });

        if (authRes.status === 200) {
            token = JSON.parse(authRes.body).token;
        }
    });

    

    group('Delete Member', () => {
        // 手動替換 ID，構造完整的 URL
        const url = `http://localhost:8080/api/admin_delete_user/${userIdToDelete}`;
    
        // 發送 DELETE 請求
        const res = http.del(url, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
    
        // 打印響應內容以便調試
        console.log(`Response status: ${res.status}, body: ${res.body}`);
    
        // 驗證響應狀態碼和消息
        check(res, {
            'Member deleted successfully': (r) => r.status === 200,
            'Correct response message': (r) => r.body.includes('User deleted successfully'),
        });
    });

    sleep(1); // Simulate delay
}
