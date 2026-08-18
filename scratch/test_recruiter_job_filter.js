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

async function runRecruiterJobFilterTest() {
  console.log('Testing Recruiter Job Application Filter Logic...');

  // 1. Recruiter Log In
  const recruiterLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: 'recruiter@vtportal.com',
    password: 'recruiter123',
  });
  const recruiterToken = recruiterLogin.body.access_token;

  // 2. SSIPMT TPO Log In
  const adminLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: 'admin@vtportal.com',
    password: 'admin123',
  });
  const adminToken = adminLogin.body.access_token;

  // 3. Post Job 1 and Job 2
  const job1Res = await makeRequest('http://127.0.0.1:5000/company/jobs', 'POST', {
    title: 'Frontend Developer Drive',
    colleges: ['SSIPMT'],
    branches: ['Computer Science & Engineering'],
  }, recruiterToken);
  const job1Id = job1Res.body.id;

  const job2Res = await makeRequest('http://127.0.0.1:5000/company/jobs', 'POST', {
    title: 'Backend Engineer Drive',
    colleges: ['SSIPMT'],
    branches: ['Computer Science & Engineering'],
  }, recruiterToken);
  const job2Id = job2Res.body.id;

  await makeRequest(`http://127.0.0.1:5000/admin/jobs/${job1Id}/verify`, 'PUT', { status: 'Approved' }, adminToken);
  await makeRequest(`http://127.0.0.1:5000/admin/jobs/${job2Id}/verify`, 'PUT', { status: 'Approved' }, adminToken);

  // 4. Create Student A and Student B
  const studentASignup = await makeRequest('http://127.0.0.1:5000/auth/signup', 'POST', {
    name: 'Frontend Candidate A',
    email: `cand_a_${Date.now()}@ssipmt.com`,
    password: 'password123',
    role: 'student',
    collegeId: 'SSIPMT',
    branch: 'Computer Science & Engineering',
  });
  await makeRequest(`http://127.0.0.1:5000/admin/students/${studentASignup.body.id}/verify`, 'PUT', { status: 'Approved' }, adminToken);

  const studentBSignup = await makeRequest('http://127.0.0.1:5000/auth/signup', 'POST', {
    name: 'Backend Candidate B',
    email: `cand_b_${Date.now()}@ssipmt.com`,
    password: 'password123',
    role: 'student',
    collegeId: 'SSIPMT',
    branch: 'Computer Science & Engineering',
  });
  await makeRequest(`http://127.0.0.1:5000/admin/students/${studentBSignup.body.id}/verify`, 'PUT', { status: 'Approved' }, adminToken);

  // Login Students
  const studentALogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', { email: studentASignup.body.email, password: 'password123' });
  const studentBLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', { email: studentBSignup.body.email, password: 'password123' });

  // Student A applies to Job 1, Student B applies to Job 2
  await makeRequest(`http://127.0.0.1:5000/student/jobs/${job1Id}/apply`, 'POST', null, studentALogin.body.access_token);
  await makeRequest(`http://127.0.0.1:5000/student/jobs/${job2Id}/apply`, 'POST', null, studentBLogin.body.access_token);

  // 5. Fetch all company applications
  const allAppsRes = await makeRequest('http://127.0.0.1:5000/company/applications', 'GET', null, recruiterToken);
  const allApps = allAppsRes.body;
  console.log(`Total applications returned for recruiter: ${allApps.length}`);

  // Test Job 1 filtering logic
  const job1Filtered = allApps.filter((a) => (a.job_id || a.job?.id)?.toString() === job1Id.toString());
  console.log(`Job 1 filtered applications count: ${job1Filtered.length}`);
  if (job1Filtered.length !== 1 || job1Filtered[0].studentName !== 'Frontend Candidate A') {
    throw new Error('Filtering by Job 1 failed!');
  }

  // Test Job 2 filtering logic
  const job2Filtered = allApps.filter((a) => (a.job_id || a.job?.id)?.toString() === job2Id.toString());
  console.log(`Job 2 filtered applications count: ${job2Filtered.length}`);
  if (job2Filtered.length !== 1 || job2Filtered[0].studentName !== 'Backend Candidate B') {
    throw new Error('Filtering by Job 2 failed!');
  }

  console.log('\n🎉 RECRUITER JOB APPLICATION FILTER TEST PASSED SUCCESSFULLY!');
}

runRecruiterJobFilterTest().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
