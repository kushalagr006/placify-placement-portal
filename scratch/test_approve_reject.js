import http from 'http';

function loginAsAdmin() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ email: 'admin@vtportal.com', password: 'admin123' });
    const req = http.request(
      'http://127.0.0.1:5000/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => body += c);
        res.on('end', () => {
          const parsed = JSON.parse(body);
          resolve(parsed.access_token);
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function getStudents(token) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      'http://127.0.0.1:5000/admin/students',
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => body += c);
        res.on('end', () => {
          resolve(JSON.parse(body));
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

function verifyStudent(token, studentId, status) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ status });
    const req = http.request(
      `http://127.0.0.1:5000/admin/students/${studentId}/verify`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          Authorization: `Bearer ${token}`,
        },
      },
      (res) => {
        let body = '';
        res.on('data', (c) => body += c);
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, body: JSON.parse(body) });
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runVerificationTest() {
  console.log('Testing Admin Approve & Reject endpoints...');
  const token = await loginAsAdmin();
  console.log('✅ Logged in as TPO Admin.');

  const resData = await getStudents(token);
  const studentsList = Array.isArray(resData) ? resData : (resData.students || []);
  console.log(`Found ${studentsList.length} students in TPO directory.`);

  if (studentsList.length === 0) {
    console.log('No students in list.');
    return;
  }

  const targetStudent = studentsList[0];
  console.log(`Testing Approval for student: ${targetStudent.user?.name} (${targetStudent.student_id || targetStudent._id})...`);

  const approveRes = await verifyStudent(token, targetStudent.student_id || targetStudent._id, 'Approved');
  console.log('Approve response:', approveRes);

  console.log(`Testing Rejection for student: ${targetStudent.user?.name} (${targetStudent.student_id || targetStudent._id})...`);
  const rejectRes = await verifyStudent(token, targetStudent.student_id || targetStudent._id, 'Rejected');
  console.log('Reject response:', rejectRes);

  if (approveRes.statusCode === 200 && rejectRes.statusCode === 200) {
    console.log('\n🎉 APPROVAL AND REJECTION ENDPOINTS PASSED WITH 200 OK!');
  } else {
    throw new Error('Verification endpoint failed');
  }
}

runVerificationTest().catch((err) => {
  console.error('Test Error:', err);
  process.exit(1);
});
