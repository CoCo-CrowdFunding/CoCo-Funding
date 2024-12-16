//多名同時註冊
import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '3s', target: 10 }, // Ramp up to 10 virtual users in 3 seconds
        { duration: '3s', target: 10 },  // Maintain 10 virtual users for 3 seconds
        { duration: '3s', target: 0 },   // Scale down to 0 virtual users in 3 seconds
    ],
};

let token; // Used to store JWT Token

export default function () {
    let userId = Math.floor(Math.random() * 1000) + 1000; // Random user ID between 1000 and 1999
    let username = `user${userId}`;
    let email = `user${userId}@gmail.com`;
    let password = 'password123';

    group('Register: User Registration', () => {
        const registrationPayload = JSON.stringify({
            username: username,
            email: email,
            password: password,
        });
        const registrationHeaders = { 'Content-Type': 'application/json' };

        let regRes = http.post('http://localhost:8080/api/user_register', registrationPayload, { headers: registrationHeaders });

        // Check registration response
        check(regRes, {
            'POST /api/user_register status was 200': (r) => r.status === 200,
            'User registered successfully': (r) => {
                const responseBody = JSON.parse(r.body);
                return responseBody.message === 'Registration successful';
            },
        });

        // Print response for debugging if needed
        console.log('Registration Response Body:', regRes.body);
    });

    sleep(1); // Simulate a slight delay between requests
}
