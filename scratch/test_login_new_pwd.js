import axios from 'axios';

async function testLogin() {
  const accounts = [
    { email: 'stucse@ssipmt.com', label: 'Student' },
    { email: 'ad@ssipmt.com', label: 'Admin' }
  ];

  for (const acc of accounts) {
    try {
      const res = await axios.post('http://127.0.0.1:5000/auth/login', {
        email: acc.email,
        password: 'kushal1234'
      });
      console.log(`✅ ${acc.label} (${acc.email}) login SUCCESS! Role: ${res.data.role}, User ID: ${res.data.user_id}`);
    } catch (err) {
      console.error(`❌ ${acc.label} (${acc.email}) login FAILED:`, err.response?.data || err.message);
    }
  }
}

testLogin();
