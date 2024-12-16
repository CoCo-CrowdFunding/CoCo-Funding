// Use the following command to run the test:
// k6 run tests\k6\proposal_k6_test_3.js 

// 多名使用者同時瀏覽首頁->查看提案詳細內容->付款

import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '3s', target: 1 }, // 30秒內模擬20個虛擬使用者
        { duration: '5s', target: 1 },  // 維持20個虛擬使用者1分鐘
        { duration: '5s', target: 0 },  // 最後30秒逐步減少虛擬使用者數量
    ],
};

let token; // 用於存放 JWT Token
let userCommentHistory = {};// 用於追蹤每個使用者是否已對某提案留言

export default function () {

    // 多名使用者同時瀏覽首頁->查看提案詳細內容->留言

    let proposalId; // 儲存動態取得的提案 ID
    let userId = Math.floor(Math.random() * 1000) + 1; // 隨機生成使用者 ID

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
        }
    });

    if (!proposalId) return;

    group('GET: Fetch proposal details', () => {
        // 查看提案詳細內容
        let res2 = http.get(`https://coco-442901.de.r.appspot.com/api/get_proposal_detail/${proposalId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        check(res2, {
            'GET /api/get_proposal_detail status was 200': (r) => r.status === 200,
            'Proposal details are correct': (r) => {
                const proposal = JSON.parse(r.body);
                return proposal && proposal.proposal_id === proposalId;
            },
        });
    });


    // 檢查該使用者是否已對此提案留言
    if (!userCommentHistory[userId]) {
        userCommentHistory[userId] = new Set(); // 初始化使用者留言記錄
    }
    if (userCommentHistory[userId].has(proposalId)) {
        console.log(`User ${userId} has already commented on proposal ${proposalId}. Skipping.`);
        return; // 跳過留言
    }

    group('POST: Comment on proposal', () => {
        // 對提案留言
        const payload = JSON.stringify({
            proposal_id: proposalId,
            user_id: Math.floor(Math.random() * 100) + 1, // 隨機生成使用者 ID
            comment: `This is a test comment from user ${__VU}-${__ITER}.`,
            rate: Math.floor(Math.random() * 5) + 1, // 隨機評分 1~5
            created: new Date().toISOString(),
        });

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 加入 Token
        };

        let res3 = http.post('https://coco-442901.de.r.appspot.com/api/comment_add', payload, { headers: headers });

        // 檢查狀態碼是否為 201 或 400
        check(res3, {
            'POST /api/comment_add status was 201 or 400': (r) =>
                r.status === 201 || (r.status === 400 && JSON.parse(r.body).message === "User has already commented on this proposal."),
        });

        // 檢查留言是否成功新增或已存在
        check(res3, {
            'Comment added successfully or already exists': (r) => {
                if (r.status === 201) {
                    const responseMessage = JSON.parse(r.body).message;
                    return responseMessage === "Comment and rate successfully added.";
                } else if (r.status === 400) {
                    return JSON.parse(r.body).message === "User has already commented on this proposal.";
                }
                return false;
            },
        });
    });

    sleep(1); // 模擬操作延遲
}