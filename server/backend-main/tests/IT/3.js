import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '5s', target: 1 } // Ramp-up to 5 users
      
    ],
};

let userToken;

export default function () {
    group('Authenticate: User Login to Get Token', () => {
            const userPayload = JSON.stringify({
      email: "12345@gmail.com",
      password: "1234512345"
            });
            const headers = { 'Content-Type': 'application/json' };
    
            const userRes = http.post('http://localhost:8080/api/user_login', userPayload, { headers });
    
            check(userRes, {
                'User login successful': (r) => r.status === 200,
            });
    
            if (userRes.status === 200) {
                userToken = JSON.parse(userRes.body).token;
            }
        });

    if (!userToken) return;

    let proposalId;

    group('Retrieve All Proposals', () => {
        const res = http.get('http://localhost:8080/api/get_all_proposal', {
            
        });

        check(res, {
            'Status was 200': (r) => r.status === 200,
            'Proposals returned': (r) => JSON.parse(r.body).length > 0,
        });

        const proposals = JSON.parse(res.body);
        if (proposals.length > 0) {
            proposalId = proposals[0].proposal_id; // Use the first proposal for testing
        }
    });

    if (!proposalId) return;

    

    group('Purchase Proposal', () => {
        const payload = JSON.stringify({
            user_id: 1,
            proposal_id: proposalId,
            proposal_amount: 100,
        });

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
        };

        const res = http.put('http://localhost:8080/api/purchase_proposal', payload, { headers });

        check(res, {
            'Purchase successful': (r) => r.status === 200,
            'Correct response message': (r) => JSON.parse(r.body).message === 'Purchase successful',
        });
    });

    group('Retrieve Sponsor History', () => {
        const res = http.get('http://localhost:8080/api/user_get_sponsor_history/1', {
            headers: { Authorization: `Bearer ${userToken}` },
        });

        check(res, {
            'Sponsor history retrieved': (r) => r.status === 200,
            'Sponsor history is not empty': (r) => JSON.parse(r.body).purchases_record.length > 0,
        });
    });

    group('Refund Purchase', () => {
        const res = http.del(`http://localhost:8080/api/remove_purchase/1/${proposalId}`, null, {
            headers: { Authorization: `Bearer ${userToken}` },
        });

        check(res, {
            'Refund successful': (r) => r.status === 200,
            'Correct response message': (r) => JSON.parse(r.body).message === 'Purchase record removed and proposal updated successfully',
        });
    });

    sleep(1); // Simulate user delay between actions
}
