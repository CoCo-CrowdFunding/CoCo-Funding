import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '3s', target: 5 }, // Ramp-up to 5 users
        { duration: '5s', target: 5 }, // Stay at 5 users
        { duration: '3s', target: 0 }, // Ramp-down to 0 users
    ],
};

let adminToken;
let userToken;
let userIdToDelete = 56;
export default function () {
    // Admin Login
    group('Authenticate: Admin Login to Get Token', () => {
        const adminPayload = JSON.stringify({
            "username": "admin1234",
            "email": "admin@example.com",
            "password": "securepassword1"
        });
        const headers = { 'Content-Type': 'application/json' };

        const adminRes = http.post('http://localhost:8080/api/admin_login', adminPayload, { headers });

        check(adminRes, {
            'Admin login successful': (r) => r.status === 200
        });

        if (adminRes.status === 200) {
            adminToken = JSON.parse(adminRes.body).token;
        }
    });

    // User Login
    group('Authenticate: User Login to Get Token', () => {
        const userPayload = JSON.stringify({
  "email": "12345@gmail.com",
  "password": "1234512345"
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

    if (!adminToken || !userToken) return;

// User-specific actions
group('Member: Add New Proposal', () => {
    const payload = JSON.stringify({
        title: 'User Proposal Test',
        description: 'Proposal from user.',
        funding_goal: 5000,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
        category: 'Technology',
        establish_user_id: 1,
    });

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
    };

    // Make the POST request
    const res = http.post('http://localhost:8080/api/proposal_add', payload, { headers });

    // Check if the request was successful
    check(res, {
        'Proposal added successfully': (r) => r.status === 200,
    });

    // Parse the JSON response to extract proposal_id
    if (res.status === 200) {
        const responseBody = JSON.parse(res.body); // Parse JSON
        const proposalId = responseBody.proposal_id; // Extract proposal_id

        console.log(`Proposal ID: ${proposalId}`); // Log the proposal_id for debugging
    } else {
        console.error(`Failed to add proposal. Response: ${res.body}`);
    }
});


    // Admin-specific actions
    group('Admin: Review Proposals', () => {
        const payload = JSON.stringify({ status: 0});

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
        };

        const res = http.put(`http://localhost:8080/api/update_proposal_status/${userIdToDelete}`, payload, { headers });

        check(res, {
            'Proposal deleted successfully by admin': (r) => r.status === 200,
        });
    });

    sleep(1);
}
