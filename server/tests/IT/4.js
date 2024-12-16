import http from "k6/http";
import { check, group, sleep } from "k6";

export let options = {
  stages: [
    { duration: "3s", target: 1 }, // Ramp-up to 1 user
  ],
};

let adminToken;
let userToken;
let proposalId;

function makeGetRequest(url, token) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  return http.get(url, { headers });
}

export default function () {
  group("Authenticate: Admin Login to Get Token", () => {
    const adminPayload = JSON.stringify({
      username: "admin1234",
      email: "admin@example.com",
      password: "securepassword1",
    });
    const headers = { "Content-Type": "application/json" };

    const adminRes = http.post(
      "http://localhost:8080/api/admin_login",
      adminPayload,
      { headers }
    );

    check(adminRes, {
      "Admin login successful": (r) => r.status === 200,
    });

    if (adminRes.status === 200) {
      adminToken = JSON.parse(adminRes.body).token;
    }
  });

  group("Authenticate: User Login to Get Token", () => {
    const userPayload = JSON.stringify({
      email: "12345@gmail.com",
      password: "1234512345",
    });
    const headers = { "Content-Type": "application/json" };

    const userRes = http.post(
      "http://localhost:8080/api/user_login",
      userPayload,
      { headers }
    );

    check(userRes, {
      "User login successful": (r) => r.status === 200,
    });

    if (userRes.status === 200) {
      userToken = JSON.parse(userRes.body).token;
    }
  });

  if (!adminToken || !userToken) {
    console.error("Missing tokens. Skipping subsequent requests.");
    return;
  }

  group("Member: Add New Proposal", () => {
    const payload = JSON.stringify({
      title: "User Proposal Test4",
      description: "Proposal from user.",
      funding_goal: 5000,
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      category: "Technology",
      establish_user_id: 1,
    });

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    };

    const res = http.post(
      "http://localhost:8080/api/proposal_add",
      payload,
      { headers }
    );

    check(res, {
      "Proposal added successfully": (r) => r.status === 200,
    });

    if (res.status === 200) {
      const responseBody = JSON.parse(res.body);
      proposalId = responseBody.proposal_id;
      console.log(`Proposal ID: ${proposalId}`);
    }
  });

  if (!proposalId) {
    console.error("Proposal ID not set. Skipping subsequent requests.");
    return;
  }

  group("Query Sponsors", () => {
    const res = makeGetRequest(
      `http://localhost:8080/api/get_proposal_sponsors/${proposalId}`,
      adminToken
    );

    check(res, {
      "Sponsors retrieved successfully": (r) => r.status === 200,
    });
  });

  group("View Proposal Status", () => {
    const res = makeGetRequest(
      `http://localhost:8080/api/get_status/${proposalId}`,
      adminToken
    );

    check(res, {
      "Proposal status retrieved": (r) => r.status === 200,
    });
  });

  sleep(1);
}

