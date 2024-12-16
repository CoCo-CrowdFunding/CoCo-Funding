

// 多名使用者同時付款

import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '3s', target: 1 }, // 3 seconds to ramp up to 1 virtual user
        { duration: '3s', target: 1 },  // Maintain 1 virtual user for 3 seconds
        { duration: '3s', target: 0 },  // 3 seconds to scale down the virtual users to 0
    ],
};

let token; // Used to store JWT Token

export default function () {
    let userId = Math.floor(Math.random() * 3) + 2; // Random user ID between 2 and 4
    let proposalAmount = 100; // Assume purchase proposal amount
    let proposalId = 1; // Example proposal ID, you can replace it with your actual logic to get the ID
    let target_proposal = { current_total_amount: 1000 }; // Example proposal data for updating amount

    group('Authenticate: Login to Get Token', () => {
        const authPayload = JSON.stringify({
            username: 'Eleanor',
            email: '123@gmail.com',
            password: '12345678',
        });
        const authHeaders = { 'Content-Type': 'application/json' };

        let authRes = http.post('http://localhost:8080/api/user_login', authPayload, { headers: authHeaders });

        // Check Content-Type and parse response
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

    // Purchase proposal
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

        let purchaseRes = http.put('http://localhost:8080/api/purchase_proposal', purchasePayload, { headers: purchaseHeaders });

        // Print response body for debugging
        console.log('Response Body:', purchaseRes.body);

        check(purchaseRes, {
            'PUT /api/purchase_proposal status was 200': (r) => r.status === 200,
            'Purchase was successful': (r) => {
                const responseBody = JSON.parse(r.body);
                return responseBody.message === 'Purchase successful';
            },
            'User data updated': (r) => {
                const responseBody = JSON.parse(r.body);
                return responseBody.user && responseBody.user.user_id === userId;  // Check user data
            },
            'Proposal updated': (r) => {
                const responseBody = JSON.parse(r.body);
                const expectedAmount = proposalAmount + originalAmount;

                return responseBody.updatedProposal && responseBody.updatedProposal.current_total_amount === expectedAmount;
            }
        });
    });

    sleep(1); // Simulate a slight delay between requests
}
