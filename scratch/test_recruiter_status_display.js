import http from 'http';

function makeRequest(url, method, payload, token) {
  return new Promise((resolve, reject) => {
    const postData = payload ? JSON.stringify(payload) : null;
    const headers = {};
    if (postData) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(postData);
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, { method, headers }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ statusCode: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runRecruiterStatusDisplayTest() {
  console.log('Testing Recruiter Job TPO Approval Status Display...');

  // 1. Log in as Recruiter
  const recruiterLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: 'recruiter@vtportal.com',
    password: 'recruiter123',
  });
  const recruiterToken = recruiterLogin.body.access_token;
  console.log('✅ 1. Logged in as Recruiter.');

  // 2. Post new job drive
  const postRes = await makeRequest('http://127.0.0.1:5000/company/jobs', 'POST', {
    title: 'Recruiter Status Display Test Drive',
    description: 'Verify status displays Pending TPO Approval initially',
    package: '20.0 LPA',
    location: 'Raipur',
    colleges: ['SSIPMT'],
    branches: ['Computer Science & Engineering'],
  }, recruiterToken);

  const job = postRes.body;
  console.log(`✅ 2. Created Job. Initial Status returned to Recruiter: "${job.status}" (Expected: "Pending TPO Approval")`);

  if (job.status !== 'Pending TPO Approval') {
    throw new Error(`Initial status was "${job.status}" instead of "Pending TPO Approval"!`);
  }

  // 3. GET /company/jobs before TPO approval
  const companyJobsBefore = await makeRequest('http://127.0.0.1:5000/company/jobs', 'GET', null, recruiterToken);
  const foundBefore = companyJobsBefore.body.find((j) => j.id === job.id);
  console.log(`✅ 3. Recruiter GET /company/jobs status before approval: "${foundBefore.status}"`);

  if (foundBefore.status !== 'Pending TPO Approval') {
    throw new Error('GET /company/jobs status before approval was incorrect!');
  }

  // 4. SSIPMT TPO approves job drive
  const adminLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: 'admin@vtportal.com',
    password: 'admin123',
  });
  const adminToken = adminLogin.body.access_token;

  await makeRequest(`http://127.0.0.1:5000/admin/jobs/${job.id}/verify`, 'PUT', { status: 'Approved' }, adminToken);
  console.log('✅ 4. SSIPMT TPO approved the job drive.');

  // 5. GET /company/jobs after TPO approval
  const companyJobsAfter = await makeRequest('http://127.0.0.1:5000/company/jobs', 'GET', null, recruiterToken);
  const foundAfter = companyJobsAfter.body.find((j) => j.id === job.id);
  console.log(`✅ 5. Recruiter GET /company/jobs status after TPO approval: "${foundAfter.status}" (Expected: "Active")`);

  if (foundAfter.status !== 'Active') {
    throw new Error('GET /company/jobs status after approval was incorrect!');
  }

  console.log('\n🎉 RECRUITER TPO STATUS DISPLAY TEST PASSED SUCCESSFULLY!');
}

runRecruiterStatusDisplayTest().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
