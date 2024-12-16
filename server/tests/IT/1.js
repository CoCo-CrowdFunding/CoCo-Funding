import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const url = 'http://localhost:8080/api/user_register';
    const payload = JSON.stringify({
        username: 'TestUser',
        email: 'testuser@example.com',
        password: 'TestPassword123'
    });

    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(url, payload, params);

    check(res, {
        'status was 201': (r) => r.status === 201,
        'response contains success message': (r) => r.body.includes('User registered successfully'),
    });
}
