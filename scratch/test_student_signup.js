import http from 'http';

function testSignup() {
  const postData = JSON.stringify({
    name: 'KUSHAL',
    email: 'stuit@ssipmt.com',
    password: 'password123',
    role: 'student',
    collegeId: 'SSIPMT',
    branch: 'Information Technology',
  });

  const req = http.request(
    'http://127.0.0.1:5000/auth/signup',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    },
    (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log(`HTTP Status: ${res.statusCode}`);
        console.log('Response Body:', body);
      });
    }
  );

  req.on('error', (err) => {
    console.error('HTTP Request Error:', err.message);
  });

  req.write(postData);
  req.end();
}

testSignup();
