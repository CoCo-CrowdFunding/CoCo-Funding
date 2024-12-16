// Use the following command to run the test:
// k6 run tests\k6\proposal_k6_test_1.js 

// 多名使用者同時瀏覽首頁->查看提案詳細內容->付款

import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '30s', target: 750 }, // 30秒內模擬20個虛擬使用者
        { duration: '1m', target: 750 },  // 維持20個虛擬使用者1分鐘
        { duration: '30s', target: 350 },  // 最後30秒逐步減少虛擬使用者數量
    ],
};

let token; // 用於存放 JWT Token


export default function () {

    // 多名使用者同時瀏覽首頁->查看提案詳細內容->付款

    let proposalId; // 儲存動態取得的提案 ID
    let userId = Math.floor(Math.random() * 3) + 2; // 隨機生成使用者 ID，範圍是 2 到 4
    let proposalAmount = 100; // 假設購買提案的金額
    let target_proposal;




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

    // console.log('first proposalId:', proposalId);
    if (!proposalId) return;

    // 查看提案詳細內容
    group('GET: Fetch proposal details', () => {

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

    // 購買提案
    group('PUT: Purchase proposal', () => {
        const purchasePayload = JSON.stringify({
            user_id: userId,
            proposal_amount: proposalAmount,
            proposal_id: proposalId,
        });

        const originalAmount = target_proposal.current_total_amount;

        const purchaseHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        let purchaseRes = http.put('https://coco-442901.de.r.appspot.com/api/purchase_proposal', purchasePayload, { headers: purchaseHeaders });

        // 印出回應的 body 以供檢查
        // console.log('Response Body:', purchaseRes.body);

        check(purchaseRes, {
            'PUT /api/purchase_proposal status was 200': (r) => r.status === 200,
            'Purchase was successful': (r) => {
                const responseBody = JSON.parse(r.body);
                return responseBody.message === 'Purchase successful';
            },
            'User data updated': (r) => {
                const responseBody = JSON.parse(r.body);
                return responseBody.user && responseBody.user.user_id === userId;  // 檢查用戶資料是否正確
            },
            'Proposal updated': (r) => {
                const responseBody = JSON.parse(r.body);
                const proposalAmount = 100; // 設定您要測試的贊助金額，這裡假設為 100
                const expectedAmount = proposalAmount + originalAmount;

                return responseBody.updatedProposal && responseBody.updatedProposal.current_total_amount === expectedAmount;
            }
        });
    });


    sleep(1); // 模擬操作延遲
}