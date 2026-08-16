import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';

async function runTest() {
  console.log('Testing Final TPO Selection Approval Workflow...');
  const timestamp = Date.now();

  // 1. Fetch Colleges First
  const collegesRes = await axios.get(`${BASE_URL}/auth/colleges`);
  const colleges = collegesRes.data;
  const ssipmtCollege = colleges.find((c) => c.code === 'SSIPMT');
  const csvtuCollege = colleges.find((c) => c.code === 'CSVTU');

  // 2. Register Recruiter, SSIPMT TPO, CSVTU TPO, and SSIPMT Student
  await axios.post(`${BASE_URL}/auth/signup`, {
    name: `Tech Corp ${timestamp}`,
    email: `recruiter_${timestamp}@techcorp.com`,
    password: 'password123',
    role: 'company',
  });
  const recruiterLogin = await axios.post(`${BASE_URL}/auth/login`, {
    email: `recruiter_${timestamp}@techcorp.com`,
    password: 'password123',
    role: 'company',
  });
  const recruiterToken = recruiterLogin.data.access_token;

  await axios.post(`${BASE_URL}/auth/signup`, {
    name: `SSIPMT TPO ${timestamp}`,
    email: `ssipmt_tpo_${timestamp}@ssipmt.com`,
    password: 'password123',
    role: 'admin',
    collegeId: ssipmtCollege._id,
  });
  const ssipmtTpoLogin = await axios.post(`${BASE_URL}/auth/login`, {
    email: `ssipmt_tpo_${timestamp}@ssipmt.com`,
    password: 'password123',
    role: 'admin',
  });
  const ssipmtTpoToken = ssipmtTpoLogin.data.access_token;

  await axios.post(`${BASE_URL}/auth/signup`, {
    name: `CSVTU TPO ${timestamp}`,
    email: `csvtu_tpo_${timestamp}@csvtu.ac.in`,
    password: 'password123',
    role: 'admin',
    collegeId: csvtuCollege._id,
  });
  const csvtuTpoLogin = await axios.post(`${BASE_URL}/auth/login`, {
    email: `csvtu_tpo_${timestamp}@csvtu.ac.in`,
    password: 'password123',
    role: 'admin',
  });
  const csvtuTpoToken = csvtuTpoLogin.data.access_token;

  await axios.post(`${BASE_URL}/auth/signup`, {
    name: `Applicant ${timestamp}`,
    email: `student_${timestamp}@ssipmt.com`,
    password: 'password123',
    role: 'student',
    collegeId: ssipmtCollege._id,
    branch: 'Computer Science & Engineering',
  });
  const studentLogin = await axios.post(`${BASE_URL}/auth/login`, {
    email: `student_${timestamp}@ssipmt.com`,
    password: 'password123',
    role: 'student',
  });
  const studentToken = studentLogin.data.access_token;

  // Bind SSIPMT TPO & Student to SSIPMT College
  await axios.put(
    `${BASE_URL}/admin/profile`,
    { college_id: ssipmtCollege._id },
    { headers: { Authorization: `Bearer ${ssipmtTpoToken}` } }
  );

  await axios.put(
    `${BASE_URL}/student/profile`,
    { college_id: ssipmtCollege._id, branch: 'Computer Science & Engineering', semester: 8, cgpa: 9.1 },
    { headers: { Authorization: `Bearer ${studentToken}` } }
  );

  // SSIPMT TPO approves student registration
  const studentProfileRes = await axios.get(`${BASE_URL}/admin/students`, {
    headers: { Authorization: `Bearer ${ssipmtTpoToken}` },
  });
  const ssipmtStudentObj = studentProfileRes.data.find((s) => s.user?.email === `student_${timestamp}@ssipmt.com`);
  if (ssipmtStudentObj) {
    await axios.put(
      `${BASE_URL}/admin/students/${ssipmtStudentObj.student_id || ssipmtStudentObj.id}/verify`,
      { status: 'Approved' },
      { headers: { Authorization: `Bearer ${ssipmtTpoToken}` } }
    );
    console.log('✅ SSIPMT TPO approved student registration.');
  }

  // 3. Recruiter creates job drive
  const jobRes = await axios.post(
    `${BASE_URL}/company/jobs`,
    { title: `Software Engineer ${timestamp}`, description: 'Full stack dev', package: '12 LPA', selected_colleges: [ssipmtCollege._id], eligible_branches: ['Computer Science & Engineering'] },
    { headers: { Authorization: `Bearer ${recruiterToken}` } }
  );
  const jobId = jobRes.data.job_id || jobRes.data.id;

  // TPO approves job drive so student can apply
  await axios.put(
    `${BASE_URL}/admin/jobs/${jobId}/verify`,
    { status: 'Approved' },
    { headers: { Authorization: `Bearer ${ssipmtTpoToken}` } }
  );

  // 4. Student applies to job
  const applyRes = await axios.post(
    `${BASE_URL}/student/jobs/${jobId}/apply`,
    {},
    { headers: { Authorization: `Bearer ${studentToken}` } }
  );
  const appId = applyRes.data.application_id || applyRes.data.id;
  console.log('✅ Student applied successfully. Initial status:', applyRes.data.status);

  // 5. Recruiter accepts candidate
  const companyUpdateRes = await axios.put(
    `${BASE_URL}/company/applications/${appId}/status`,
    { status: 'Selected', remarks: 'Recruiter accepted candidate after interviews' },
    { headers: { Authorization: `Bearer ${recruiterToken}` } }
  );
  console.log('✅ Recruiter updated status. Transformed status:', companyUpdateRes.data.status);
  if (companyUpdateRes.data.status !== 'Pending TPO Approval') {
    throw new Error(`Expected status 'Pending TPO Approval', got '${companyUpdateRes.data.status}'`);
  }

  // 6. CSVTU TPO attempts to verify SSIPMT student -> verify HTTP 403 Forbidden
  try {
    await axios.put(
      `${BASE_URL}/admin/applications/${appId}/verify`,
      { status: 'Selected' },
      { headers: { Authorization: `Bearer ${csvtuTpoToken}` } }
    );
    throw new Error('CSVTU TPO should NOT be able to verify SSIPMT student selection!');
  } catch (err) {
    if (err.response?.status === 403) {
      console.log('✅ Cross-college protection verified: CSVTU TPO received HTTP 403 Forbidden.');
    } else {
      throw err;
    }
  }

  // 7. SSIPMT TPO fetches applications & approves selection
  const tpoAppsRes = await axios.get(`${BASE_URL}/admin/applications`, {
    headers: { Authorization: `Bearer ${ssipmtTpoToken}` },
  });
  const targetApp = tpoAppsRes.data.find((a) => (a.application_id || a.id) === appId);
  console.log('✅ SSIPMT TPO fetched target application:', targetApp ? targetApp.status : 'Not Found');

  const tpoVerifyRes = await axios.put(
    `${BASE_URL}/admin/applications/${appId}/verify`,
    { status: 'Selected', remarks: 'SSIPMT TPO verified candidate eligibility & accepted placement' },
    { headers: { Authorization: `Bearer ${ssipmtTpoToken}` } }
  );
  console.log('✅ SSIPMT TPO verified selection. Final status:', tpoVerifyRes.data.status);
  if (tpoVerifyRes.data.status !== 'Selected') {
    throw new Error(`Expected final status 'Selected', got '${tpoVerifyRes.data.status}'`);
  }

  // 8. Verify status history in MongoDB
  const history = tpoVerifyRes.data.status_history;
  console.log('✅ Permanent status history entries count:', history.length);
  console.log('History details:', history);

  console.log('\n🎉 ALL TPO SELECTION APPROVAL WORKFLOW TESTS PASSED SUCCESSFULLY!\n');
}

runTest().catch((err) => {
  console.error('❌ TEST FAILED:', err.response?.data || err.message);
  process.exit(1);
});
