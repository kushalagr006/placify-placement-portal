import http from 'http';

function checkRunningServer() {
  console.log('Querying running backend server at http://127.0.0.1:5000/...');

  http.get('http://127.0.0.1:5000/', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Server Status response:', data);
    });
  }).on('error', (err) => {
    console.log('Server query error:', err.message);
  });
}

checkRunningServer();
