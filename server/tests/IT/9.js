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

export default function () {
    group('Authenticate: Login to Get Token', () => {
        const authPayload = JSON.stringify({
            username: 'admin123',
            password: '123456789',
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

    group('Edit Admin Information', () => {
        const payload = JSON.stringify({
            username: 'UpdatedAdmin',
            password: 'UpdatedAdminPassword123',
        });

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };

        const res = http.put('http://localhost:8080/api/edit_admin_data', payload, { headers });

        check(res, {
            'Admin info updated successfully': (r) => r.status === 200,
            'Username is updated': (r) => JSON.parse(r.body).username === 'UpdatedAdmin',
        });
    });

    sleep(1); // Simulate delay
}
