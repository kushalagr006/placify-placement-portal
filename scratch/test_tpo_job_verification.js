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

async function runTpoVerificationWorkflowTest() {
  console.log('Testing TPO Job Drive Verification Workflow...');

  // 1. Log in as Recruiter
  const recruiterLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: 'recruiter@vtportal.com',
    password: 'recruiter123',
  });
  const recruiterToken = recruiterLogin.body.access_token;
  console.log('✅ 1. Logged in as Recruiter.');

  // 2. Post job drive targeting SSIPMT and CSVTU
  const jobPayload = {
    title: 'Full Stack Engineer (TPO Approval Test)',
    description: 'Requires TPO Approval before students can see this drive',
    package: '28.0 LPA',
    location: 'Remote',
    eligibility: 'Min 7.0 CGPA',
    deadline: '2026-12-31',
    colleges: ['SSIPMT', 'CSVTU'],
    branches: ['Computer Science & Engineering', 'Information Technology'],
  };

  const createRes = await makeRequest('http://127.0.0.1:5000/company/jobs', 'POST', jobPayload, recruiterToken);
  const job = createRes.body;
  console.log(`✅ 2. Job created (ID: ${job.id}) with ${job.college_approvals.length} pending TPO approvals.`);

  // 3. Signup & approve SSIPMT Student
  const ssipmtStudentEmail = `ssipmt_student_${Date.now()}@ssipmt.com`;
  const ssipmtStudentSignup = await makeRequest('http://127.0.0.1:5000/auth/signup', 'POST', {
    name: 'SSIPMT Student',
    email: ssipmtStudentEmail,
    password: 'password123',
    role: 'student',
    collegeId: 'SSIPMT',
    branch: 'Computer Science & Engineering',
  });

  const ssipmtTpoLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: 'admin@vtportal.com',
    password: 'admin123',
  });
  const ssipmtTpoToken = ssipmtTpoLogin.body.access_token;

  await makeRequest(`http://127.0.0.1:5000/admin/students/${ssipmtStudentSignup.body.id}/verify`, 'PUT', { status: 'Approved' }, ssipmtTpoToken);

  // 4. Log in as SSIPMT Student BEFORE TPO Job Approval
  const ssipmtStudentLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: ssipmtStudentEmail,
    password: 'password123',
  });
  const ssipmtStudentToken = ssipmtStudentLogin.body.access_token;

  let ssipmtJobsRes = await makeRequest('http://127.0.0.1:5000/student/jobs', 'GET', null, ssipmtStudentToken);
  const foundBeforeApproval = ssipmtJobsRes.body.find((j) => j.title === 'Full Stack Engineer (TPO Approval Test)');
  console.log(`✅ 3. Job visible to SSIPMT Student before TPO Approval: ${!!foundBeforeApproval} (Expected: false)`);

  if (foundBeforeApproval) {
    throw new Error('Unapproved job was visible to student!');
  }

  // 5. SSIPMT TPO approves job drive for SSIPMT
  const approveRes = await makeRequest(`http://127.0.0.1:5000/admin/jobs/${job.id}/verify`, 'PUT', { status: 'Approved' }, ssipmtTpoToken);
  console.log(`✅ 4. SSIPMT TPO approved job drive (Status: ${approveRes.statusCode}, TPO Status: ${approveRes.body.tpo_status})`);

  // 6. Check SSIPMT Student AFTER TPO Approval
  ssipmtJobsRes = await makeRequest('http://127.0.0.1:5000/student/jobs', 'GET', null, ssipmtStudentToken);
  const foundAfterApproval = ssipmtJobsRes.body.find((j) => j.title === 'Full Stack Engineer (TPO Approval Test)');
  console.log(`✅ 5. Job visible to SSIPMT Student after TPO Approval: ${!!foundAfterApproval} (Expected: true)`);

  if (!foundAfterApproval) {
    throw new Error('Approved job was not visible to SSIPMT student!');
  }

  // 7. Verify CSVTU TPO token cannot approve jobs for another college if not targeted
  const singleCollegeJobRes = await makeRequest('http://127.0.0.1:5000/company/jobs', 'POST', {
    title: 'BIT Exclusive Drive',
    description: 'Exclusive for BIT DURG',
    colleges: ['BIT'],
    branches: ['Computer Science & Engineering'],
  }, recruiterToken);

  const unauthorizedApprovalRes = await makeRequest(`http://127.0.0.1:5000/admin/jobs/${singleCollegeJobRes.body.id}/verify`, 'PUT', { status: 'Approved' }, ssipmtTpoToken);
  console.log(`✅ 6. Unauthorized TPO approval attempt status: ${unauthorizedApprovalRes.statusCode} (Expected: 403)`);

  if (unauthorizedApprovalRes.statusCode !== 403) {
    throw new Error('TPO was able to approve a job drive for another college!');
  }

  console.log('\n🎉 ALL TPO JOB VERIFICATION WORKFLOW TESTS PASSED SUCCESSFULLY!');
}

runTpoVerificationWorkflowTest().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
