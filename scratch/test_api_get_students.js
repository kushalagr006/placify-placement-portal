import axios from 'axios';

async function testAdminStudents() {
  try {
    console.log('Logging in as SSIPMT TPO admin (admin@vtportal.com)...');
    const loginRes = await axios.post('http://127.0.0.1:5000/auth/login', {
      email: 'admin@vtportal.com',
      password: 'admin123'
    });
    const token = loginRes.data.access_token;
    console.log('Login successful! Access token acquired.');

    const studentsRes = await axios.get('http://127.0.0.1:5000/admin/students', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`\nGET /admin/students returned ${studentsRes.data.length} students:`);
    studentsRes.data.forEach((s, idx) => {
      console.log(`[${idx+1}] Name: ${s.user?.name} | Email: ${s.user?.email} | Status: ${s.verification_status} | Branch: ${s.branch} | Sem: ${s.semester} | CGPA: ${s.cgpa}`);
    });
  } catch (err) {
    console.error('API Test Error:', err.response?.data || err.message);
  }
}

testAdminStudents();
