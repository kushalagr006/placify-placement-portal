import http from 'http';

function purgeUserViaHttp(email) {
  console.log(`Sending HTTP DELETE request to running backend server for email: ${email}...`);

  const req = http.request(
    `http://127.0.0.1:5000/auth/purge/${encodeURIComponent(email)}`,
    { method: 'DELETE' },
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

  req.end();
}

purgeUserViaHttp('ad@ssipmt.com');
