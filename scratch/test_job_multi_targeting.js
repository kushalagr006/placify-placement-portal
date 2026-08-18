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

async function runMultiTargetingTest() {
  console.log('Testing Multi-College & Multi-Branch Job Drive Targeting...');

  // 1. Log in as Recruiter
  const recruiterLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: 'recruiter@vtportal.com',
    password: 'recruiter123',
  });
  const recruiterToken = recruiterLogin.body.access_token;
  console.log('✅ Logged in as Recruiter.');

  // 2. Post job drive targeting SSIPMT + CSVTU and CSE + IT
  const jobPayload = {
    title: 'Senior Software Developer (Targeted)',
    description: 'Targeted drive for CSE & IT candidates at SSIPMT & CSVTU',
    package: '32.0 LPA',
    location: 'Bengaluru / Hybrid',
    eligibility: 'Min 7.5 CGPA',
    deadline: '2026-12-31',
    colleges: ['SSIPMT', 'CSVTU'],
    branches: ['Computer Science & Engineering', 'Information Technology'],
  };

  const createRes = await makeRequest('http://127.0.0.1:5000/company/jobs', 'POST', jobPayload, recruiterToken);
  console.log('Job creation status:', createRes.statusCode);

  const job = createRes.body;
  if (!Array.isArray(job.colleges) || job.colleges.length !== 2) {
    throw new Error('Targeted colleges array was not saved properly!');
  }
  if (!Array.isArray(job.branches) || job.branches.length !== 2) {
    throw new Error('Targeted branches array was not saved properly!');
  }
  console.log(`✅ Job created successfully targeting ${job.colleges.length} colleges and ${job.branches.length} branches.`);

  // 3. Signup fresh student at SSIPMT with IT branch
  const studentEmail = `targeted_student_${Date.now()}@ssipmt.com`;
  const signupRes = await makeRequest('http://127.0.0.1:5000/auth/signup', 'POST', {
    name: 'Targeted Student',
    email: studentEmail,
    password: 'password123',
    role: 'student',
    collegeId: 'SSIPMT',
    branch: 'Information Technology',
  });
  console.log(`Student signup status: ${signupRes.statusCode}`);

  // 4. Log in as TPO Admin & Approve student
  const adminLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: 'admin@vtportal.com',
    password: 'admin123',
  });
  const adminToken = adminLogin.body.access_token;
  await makeRequest(`http://127.0.0.1:5000/admin/students/${signupRes.body.id}/verify`, 'PUT', { status: 'Approved' }, adminToken);

  // 5. Log in as fresh Approved SSIPMT Student & query jobs
  const studentLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: studentEmail,
    password: 'password123',
  });
  const studentToken = studentLogin.body.access_token;

  const studentJobsRes = await makeRequest('http://127.0.0.1:5000/student/jobs', 'GET', null, studentToken);
  console.log(`Eligible SSIPMT Student received ${studentJobsRes.body.length} jobs.`);

  const foundTargetedJob = studentJobsRes.body.find((j) => j.title === 'Senior Software Developer (Targeted)');
  if (!foundTargetedJob) {
    throw new Error('Eligible student was not able to see targeted job drive!');
  }

  console.log('Targeted Job visible to student:', {
    title: foundTargetedJob.title,
    colleges: foundTargetedJob.colleges.map((c) => c.code || c.name),
    branches: foundTargetedJob.branches,
  });

  console.log('\n🎉 MULTI-COLLEGE & MULTI-BRANCH JOB TARGETING TEST PASSED SUCCESSFULLY!');
}

runMultiTargetingTest().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
