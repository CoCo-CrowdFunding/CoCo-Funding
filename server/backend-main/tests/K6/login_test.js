// Use the following command to run the test:
// k6 run tests\k6\login_test.js 


import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        // 第一組階段：從 50 到 75，再回到 50
        { duration: '30s', target: 50 },
        { duration: '1m', target: 75 },
        { duration: '30s', target: 50 },

        // 第二組階段：從 100 到 300，再回到 100
        // { duration: '30s', target: 100 },
        // { duration: '1m', target: 300 },
        // { duration: '30s', target: 100 },

        // 第三組階段：從 1000 到 1500，再回到 500
        // { duration: '30s', target: 1000 },
        // { duration: '1m', target: 1500 },
        // { duration: '30s', target: 500 },

        // 第四組階段：從 1500 到 2000，再回到 500
        // { duration: '30s', target: 1500 },
        // { duration: '1m', target: 2000 },
        // { duration: '30s', target: 500 },

        // 第五組階段：從 2000 到 3000，再回到 1000
        // { duration: '30s', target: 2000 },
        // { duration: '1m', target: 3000 },
        // { duration: '30s', target: 1000 },
    ],
};


let token; // 用於存放 JWT Token

export default function () {

    group('Authenticate: Login to Get Token', () => {

        const authPayload = JSON.stringify({
            username: 'Eleanor',
            email: '123@gmail.com',
            password: '12345678',
        });
        const authHeaders = { 'Content-Type': 'application/json' };

        let authRes = http.post('https://coco-442901.de.r.appspot.com/api/user_login', authPayload, { headers: authHeaders });

        // 檢查 Content-Type 是否正確
        const contentType = authRes.headers['Content-Type'] || '';
        if (!contentType.includes('application/json')) {
            console.error('Unexpected Content-Type:', contentType);
            // console.error('Response Body:', authRes.body);
            return;
        }

        // 確保回應為 JSON 並解析
        const responseBody = JSON.parse(authRes.body);
        check(authRes, {
            'POST /api/login status was 200': (r) => r.status === 200,
            'Token received': (r) => responseBody.token !== undefined,
        });

        if (authRes.status === 200) {
            token = responseBody.token;
        } else {
            // console.error('Failed to authenticate and retrieve token:', authRes.body);
            console.error('Failed to authenticate and retrieve token');

        }
    });

    if (!token) {
        console.error('No token available for further tests.');
        return;
    }
}