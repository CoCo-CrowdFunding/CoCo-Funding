// Use the following command to run the test:
// k6 run tests\k6\proposal_k6_test_2.js 

// 多名使用者同時瀏覽首頁->新增提案->修改提案->刪除提案

import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 700 }, // 30秒內模擬20個虛擬使用者
        { duration: '1m', target: 800 },  // 維持20個虛擬使用者1分鐘
        { duration: '30s', target: 300 },  // 最後30秒逐步減少虛擬使用者數量
    ],
};

let token; // 用於存放 JWT Token
let target_proposal;



export default function () {

    // 多名使用者同時瀏覽首頁->新增提案->修改提案->刪除提案


    let proposalId; // 儲存動態取得的提案 ID
    let userId = Math.floor(Math.random() * 3) + 2; // 隨機生成使用者 ID，範圍是 2 到 4

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
            console.error('Response Body:', authRes.body);
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
            console.error('Failed to authenticate and retrieve token:', authRes.body);
        }
    });

    if (!token) {
        console.error('No token available for further tests.');
        return;
    }

    // 多名使用者同時瀏覽首頁
    group('GET: Fetch all proposals', () => {
        // 瀏覽首頁
        let res1 = http.get('https://coco-442901.de.r.appspot.com/api/get_all_proposal');
        check(res1, {
            'GET /api/get_all_proposal status was 200': (r) => r.status === 200,
            'Response is not empty': (r) => r.body.length > 0,
        });

        // 動態取得第一個提案 ID
        const proposals = JSON.parse(res1.body);
        if (proposals.length > 0) {
            proposalId = proposals[0].proposal_id; // 假設第一筆提案為目標提案
            target_proposal = proposals[0];
        }
    });

    if (!proposalId) return;

    // 新增提案
    group('POST: Create new proposal', () => {
        const newProposal = JSON.stringify({
            title: '測試提案',
            description: '這是測試提案的描述',
            funding_goal: 10000,
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            category: '測試類別',
            establish_user_id: Math.floor(Math.random() * 3) + 2, // 隨機生成使用者 ID
        });
        const newProposalHeaders = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        let createRes = http.post('https://coco-442901.de.r.appspot.com/api/proposal_add', newProposal, { headers: newProposalHeaders });

        check(createRes, {
            'POST /api/proposal_add status was 200': (r) => r.status === 200,
            'Proposal created successfully': (r) => JSON.parse(r.body).title === '測試提案',
        });

        const createdProposal = JSON.parse(createRes.body);
        proposalId = createdProposal.proposal_id; // 記錄新增提案的 ID
    });

    if (!proposalId) return;

    // 修改提案
    group('PUT: Update proposal', () => {
        const updatedProposal = JSON.stringify({
            title: '修改後的提案標題',
            description: '這是修改後的描述',
        });

        const updateHeaders = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        let updateRes = http.put(`https://coco-442901.de.r.appspot.com/api/proposal_edit/${proposalId}`, updatedProposal, { headers: updateHeaders });

        check(updateRes, {
            'PUT /api/proposal_edit status was 200': (r) => r.status === 200,
            'Proposal updated successfully': (r) => {
                const responseBody = JSON.parse(r.body);
                return responseBody.title === '修改後的提案標題';
            },
        });
    });

    // 刪除提案
    group('DELETE: Delete proposal', () => {
        let deleteRes = http.del(`https://coco-442901.de.r.appspot.com/api/proposal_delete/${proposalId}`, null, {
            headers: { Authorization: `Bearer ${token}` },
        });

        check(deleteRes, {
            'DELETE /api/proposal_delete status was 200': (r) => r.status === 200,
            'Proposal deleted successfully': (r) => r.body.includes('Proposal deleted'),
        });
    });

    sleep(1); // 模擬操作延遲
}