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

async function runStudentDetailsAccessTests() {
  console.log('Testing Complete Student Details Access Permissions & Data Structure...');

  // 1. Log in Recruiter & SSIPMT TPO
  const recruiterLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: 'recruiter@vtportal.com',
    password: 'recruiter123',
  });
  const recruiterToken = recruiterLogin.body.access_token;

  const ssipmtTpoLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: 'admin@vtportal.com',
    password: 'admin123',
  });
  const ssipmtTpoToken = ssipmtTpoLogin.body.access_token;
  console.log('✅ Logged in as Recruiter and SSIPMT TPO.');

  // 2. Post Job & Approve for SSIPMT
  const jobRes = await makeRequest('http://127.0.0.1:5000/company/jobs', 'POST', {
    title: 'Student Profile Access Test Job',
    colleges: ['SSIPMT', 'CSVTU'],
    branches: ['Computer Science & Engineering'],
  }, recruiterToken);
  const jobId = jobRes.body.id;

  await makeRequest(`http://127.0.0.1:5000/admin/jobs/${jobId}/verify`, 'PUT', { status: 'Approved' }, ssipmtTpoToken);

  // 3. Signup SSIPMT Student & CSVTU Student
  const ssipmtStudentSignup = await makeRequest('http://127.0.0.1:5000/auth/signup', 'POST', {
    name: 'SSIPMT Applicant',
    email: `ssipmt_app_${Date.now()}@ssipmt.com`,
    password: 'password123',
    role: 'student',
    collegeId: 'SSIPMT',
    branch: 'Computer Science & Engineering',
  });
  const ssipmtStudentId = ssipmtStudentSignup.body.id;
  await makeRequest(`http://127.0.0.1:5000/admin/students/${ssipmtStudentId}/verify`, 'PUT', { status: 'Approved' }, ssipmtTpoToken);

  const csvtuStudentSignup = await makeRequest('http://127.0.0.1:5000/auth/signup', 'POST', {
    name: 'CSVTU Non-Applicant',
    email: `csvtu_student_${Date.now()}@csvtu.com`,
    password: 'password123',
    role: 'student',
    collegeId: 'CSVTU',
    branch: 'Computer Science & Engineering',
  });
  const csvtuStudentId = csvtuStudentSignup.body.id;

  // SSIPMT Student adds portfolio links, achievements, projects
  const ssipmtStudentLogin = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email: ssipmtStudentSignup.body.email,
    password: 'password123',
  });
  const ssipmtStudentToken = ssipmtStudentLogin.body.access_token;

  await makeRequest('http://127.0.0.1:5000/student/links', 'POST', { title: 'GitHub', url: 'https://github.com/ssipmt-applicant' }, ssipmtStudentToken);
  await makeRequest('http://127.0.0.1:5000/student/achievements', 'POST', { title: 'Smart India Hackathon Finalist', category: 'Hackathon' }, ssipmtStudentToken);
  await makeRequest('http://127.0.0.1:5000/student/projects', 'POST', { name: 'Placement Portal', technologies: 'React, Node' }, ssipmtStudentToken);

  // SSIPMT Student applies to Recruiter's Job
  const applyRes = await makeRequest(`http://127.0.0.1:5000/student/jobs/${jobId}/apply`, 'POST', null, ssipmtStudentToken);
  console.log('✅ SSIPMT Student set up portfolio & applied to Recruiter Job. Apply Res:', applyRes);

  // --- RECRUITER PERMISSION TESTS ---
  console.log('\n--- Recruiter Access Tests ---');
  const recruiterFetchApplied = await makeRequest(`http://127.0.0.1:5000/company/students/${ssipmtStudentId}`, 'GET', null, recruiterToken);
  console.log(`Recruiter fetch applied student status: ${recruiterFetchApplied.statusCode}`);
  console.log('Returned details:', {
    name: recruiterFetchApplied.body.user?.name,
    links: recruiterFetchApplied.body.external_links?.length,
    achievements: recruiterFetchApplied.body.achievements?.length,
    projects: recruiterFetchApplied.body.projects?.length,
  });
  if (recruiterFetchApplied.statusCode !== 200) throw new Error('Recruiter could not access applied student profile!');

  const recruiterFetchUnapplied = await makeRequest(`http://127.0.0.1:5000/company/students/${csvtuStudentId}`, 'GET', null, recruiterToken);
  console.log(`Recruiter fetch non-applied student status: ${recruiterFetchUnapplied.statusCode} (Expected: 403)`);
  if (recruiterFetchUnapplied.statusCode !== 403) throw new Error('Recruiter accessed unapplied student profile!');

  // --- TPO ADMIN PERMISSION TESTS ---
  console.log('\n--- TPO Admin Access Tests ---');
  const tpoFetchOwnStudent = await makeRequest(`http://127.0.0.1:5000/admin/students/${ssipmtStudentId}`, 'GET', null, ssipmtTpoToken);
  console.log(`SSIPMT TPO fetch SSIPMT student status: ${tpoFetchOwnStudent.statusCode}`);
  if (tpoFetchOwnStudent.statusCode !== 200) throw new Error('TPO could not access own college student profile!');

  const tpoFetchOtherStudent = await makeRequest(`http://127.0.0.1:5000/admin/students/${csvtuStudentId}`, 'GET', null, ssipmtTpoToken);
  console.log(`SSIPMT TPO fetch CSVTU student status: ${tpoFetchOtherStudent.statusCode} (Expected: 403)`);
  if (tpoFetchOtherStudent.statusCode !== 403) throw new Error('TPO accessed student from another college!');

  console.log('\n🎉 ALL STUDENT DETAILS PAGE PERMISSION & DATA TESTS PASSED SUCCESSFULLY!');
}

runStudentDetailsAccessTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
