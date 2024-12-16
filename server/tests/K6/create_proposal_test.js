// Use the following command to run the test:
// k6 run tests\k6\create_proposal_test.js 


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
        //     { duration: '30s', target: 2000 },
        //     { duration: '1m', target: 3000 },
        //     { duration: '30s', target: 1000 },
    ],
};


// 直接複製自己的 token 貼到這邊比較快
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzU5M2FjYTY5OTZmZDgyOTBhOGUzYjMiLCJ1c2VybmFtZSI6IkxJWUlOIiwiaWF0IjoxNzMzOTMxMzM3fQ.w_33D8aJQFP5_348oASgHE6qZiZsMPtC9huW-WLSQio';
let proposalId; // 儲存動態取得的提案 ID

export default function () {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // 添加 Authorization header
    };

    // 新增提案
    group('POST: Create new proposal', () => {
        const newProposal = JSON.stringify({
            title: '提案壓力測試',
            description: '軟工快結束了',
            funding_goal: 10000,
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            category: '測試',
            establish_user_id: Math.floor(Math.random() * 3) + 2, // 隨機生成使用者 ID
        });

        const newProposalHeaders = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        let createRes = http.post('https://coco-442901.de.r.appspot.com/api/proposal_add', newProposal, { headers: newProposalHeaders });

        check(createRes, {
            'POST /api/proposal_add status was 200': (r) => r.status === 200,
            'Proposal created successfully': (r) => {
                try {
                    const responseBody = JSON.parse(r.body);
                    return responseBody.title === '提案壓力測試';
                } catch (e) {
                    console.error('Failed to parse JSON:', e.message);
                    console.log('Response body:', r.body); // 顯示回應內容，便於調試
                    return false;
                }
            },
        });

        // 嘗試解析回應並獲取 proposal_id
        try {
            const createdProposal = JSON.parse(createRes.body);
            proposalId = createdProposal.proposal_id; // 記錄新增提案的 ID
        } catch (e) {
            console.error('Error parsing proposal creation response:', e.message);
        }
    });

    // 如果 proposalId 尚未設置，印出錯誤訊息
    if (!proposalId) {
        console.error('Failed to create proposal or parse response. proposalId is undefined.');
        return;
    }
}

