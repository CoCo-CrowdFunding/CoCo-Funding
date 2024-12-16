import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const url = 'http://localhost:8080/api/user_login';
    const payload = JSON.stringify({
        email: 'testuser@example.com',
        password: 'TestPassword123'
    });

    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(url, payload, params);

    check(res, {
        'status was 200': (r) => r.status === 200,
        'response contains token': (r) => JSON.parse(r.body).token !== undefined,
    });
}