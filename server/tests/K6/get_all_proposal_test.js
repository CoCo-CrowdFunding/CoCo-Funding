// Use the following command to run the test:
// k6 run tests\k6\get_all_proposal_test.js 
// k6 run --out json=output.json tests\k6\get_all_proposal_test.js


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

let target_proposal;

export default function () {
    let proposalId; // 儲存動態取得的提案 ID

    group('GET: Fetch all proposals', () => {
        // 發送 GET 請求
        let res1 = http.get('https://coco-442901.de.r.appspot.com/api/get_all_proposal', {
        });

        // 檢查回應狀態及內容
        const validResponse = check(res1, {
            'GET /api/get_all_proposal status was 200': (r) => r.status === 200,
            'Response is not empty': (r) => r.body && r.body.length > 0,
        });

        // 確認回應有效後嘗試解析 JSON
        if (validResponse) {
            try {
                const proposals = JSON.parse(res1.body);
                if (Array.isArray(proposals) && proposals.length > 0) {
                    proposalId = proposals[0].proposal_id; // 假設第一筆提案為目標提案
                    target_proposal = proposals[0];
                } else {
                    // console.error('No proposals found or response format invalid:', res1.body);
                    console.error('No proposals found or response format invalid');

                }
            } catch (error) {
                // console.error('Failed to parse JSON response:', error.message, 'Response Body:', res1.body);
                console.error('Failed to parse JSON response:', error.message);

            }
        } else {
            // console.warn('Invalid response from /api/get_all_proposal:', res1.status, res1.body);
            console.warn('Invalid response from /api/get_all_proposal');
        }

        // 模擬隨機的延遲時間，範圍為 1 到 5 秒
        sleep(Math.random() * 4 + 1);
    });

}
