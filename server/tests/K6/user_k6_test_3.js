//多名使用者同時新增提案
import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '3s', target: 10 }, // Ramp up to 10 virtual users in 3 seconds
        { duration: '3s', target: 10 },  // Maintain 10 virtual users for 3 seconds
        { duration: '3s', target: 0 },   // Scale down to 0 virtual users in 3 seconds
    ],
};

let token; // 用於存放 JWT Token
let proposalId; // 用來儲存新增的提案 ID

export default function () {
    let userId = Math.floor(Math.random() * 3) + 2; // 隨機生成使用者 ID，範圍是 2 到 4

    group('Authenticate: Login to Get Token', () => {
        const authPayload = JSON.stringify({
            username: 'Eleanor',
            email: '123@gmail.com',
            password: '12345678',
        });
        const authHeaders = { 'Content-Type': 'application/json' };

        let authRes = http.post('http://localhost:8080/api/user_login', authPayload, { headers: authHeaders });

        // 檢查 Content-Type 是否正確
        const contentType = authRes.headers['Content-Type'] || '';
        if (!contentType.includes('application/json')) {
            console.error('Unexpected Content-Type:', contentType);
            console.error('Response Body:', authRes.body);
            return;
        }

        const responseBody = JSON.parse(authRes.body);
        check(authRes, {
            'POST /api/login status was 200': (r) => r.status === 200,
            'Token received': (r) => responseBody.token !== undefined,
        });

        if (authRes.status === 200) {
            token = responseBody.token;
        } else {
            console.error('Failed to authenticate and retrieve token:', authRes.body);
        }
    });

    if (!token) {
        console.error('No token available for further tests.');
        return;
    }

    // 多名使用者同時新增提案
    group('POST: Create new proposal', () => {
        const newProposal = JSON.stringify({
            title: '測試提案',
            description: '這是測試提案的描述',
            funding_goal: 10000,
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            category: '測試類別',
            establish_user_id: userId, // 使用隨機生成的使用者 ID
        });

        const newProposalHeaders = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        let createRes = http.post('http://localhost:8080/api/proposal_add', newProposal, { headers: newProposalHeaders });

        check(createRes, {
            'POST /api/proposal_add status was 200': (r) => r.status === 200,
            'Proposal created successfully': (r) => JSON.parse(r.body).title === '測試提案',
        });

        const createdProposal = JSON.parse(createRes.body);
        proposalId = createdProposal.proposal_id; // 記錄新增提案的 ID
    });

    sleep(1); // 模擬操作延遲
}
