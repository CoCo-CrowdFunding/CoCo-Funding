import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '3s', target: 5 }, // Ramp-up to 5 users
        { duration: '5s', target: 5 }, // Stay at 5 users
        { duration: '3s', target: 0 }, // Ramp-down to 0 users
    ],
};

let token;
let proposalId = 15; // Replace with an existing proposal ID for testing
let commentId;

export default function () {
    group('Authenticate: Login to Get Token', () => {
        const authPayload = JSON.stringify({
            "email": "admin@example.com",
            "password": "securepassword"
        });
        const headers = { 'Content-Type': 'application/json' };

        const authRes = http.post('http://localhost:8080/api/admin_login', authPayload, { headers });

        check(authRes, {
            'Login successful': (r) => r.status === 200,
            'Token received': (r) => JSON.parse(r.body).token !== undefined,
        });

        if (authRes.status === 200) {
            token = JSON.parse(authRes.body).token;
        }
    });

    if (!token) return;

    group('Add Comment and Rating', () => {
        const payload = JSON.stringify({
            proposal_id: proposalId,
            user_id: 1, // Replace with valid user ID for testing
            comment: '這是評論',
            rate: 5,
            created: new Date().toISOString(), // Ensure `created` field is included
        });

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        const res = http.post('http://localhost:8080/api/comment_add', payload, { headers });

        check(res, {
            'Comment added successfully': (r) => r.status === 201,
        });

        if (res.status === 201) {
            const responseBody = JSON.parse(res.body);
            if (responseBody.proposal && responseBody.proposal.comments.length > 0) {
                commentId = responseBody.proposal.comments[0].comment_id; // Extract comment ID
            }
        }
    });

    if (!commentId) return;

    group('View All Comments for Proposal', () => {
        const res = http.get(`http://localhost:8080/api/get_all_comment/${proposalId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        check(res, {
            'Comments retrieved successfully': (r) => r.status === 200,
            'Comments are not empty': (r) => JSON.parse(r.body).length > 0,
        });
    });

    group('Delete Comment', () => {
        const res = http.del(`http://localhost:8080/api/comment_delete/${commentId}`, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(`Response status: ${res.status}, body: ${res.body}`);
        check(res, {
            'Comment deleted successfully': (r) => r.status === 200
        });
    });

    sleep(1); // Simulate delay
}
