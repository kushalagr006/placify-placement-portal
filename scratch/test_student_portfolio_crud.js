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

async function runPortfolioCrudTests() {
  console.log('Testing Student Links, Achievements & Projects CRUD Operations...');

  // 1. Signup & Login Student
  const email = `portfolio_student_${Date.now()}@ssipmt.com`;
  const signupRes = await makeRequest('http://127.0.0.1:5000/auth/signup', 'POST', {
    name: 'Portfolio Test Student',
    email,
    password: 'password123',
    role: 'student',
    collegeId: 'SSIPMT',
    branch: 'Computer Science & Engineering',
  });
  console.log('✅ 1. Student signed up successfully.');

  const loginRes = await makeRequest('http://127.0.0.1:5000/auth/login', 'POST', {
    email,
    password: 'password123',
  });
  const token = loginRes.body.access_token;
  console.log('✅ 2. Logged in as student.');

  // --- EXTERNAL LINKS TESTS ---
  console.log('\n--- Testing External Links ---');
  // Invalid URL test
  const invalidLinkRes = await makeRequest('http://127.0.0.1:5000/student/links', 'POST', {
    title: 'GitHub',
    url: 'invalid-url-string',
  }, token);
  console.log(`Invalid Link URL status: ${invalidLinkRes.statusCode} (Expected: 400)`);
  if (invalidLinkRes.statusCode !== 400) throw new Error('Backend failed to validate link URL format!');

  // Add GitHub Link
  const addGithubRes = await makeRequest('http://127.0.0.1:5000/student/links', 'POST', {
    title: 'GitHub',
    url: 'https://github.com/kushantest',
  }, token);
  console.log(`✅ Added GitHub link. Count: ${addGithubRes.body.length}`);

  // Add LinkedIn Link
  const addLinkedinRes = await makeRequest('http://127.0.0.1:5000/student/links', 'POST', {
    title: 'LinkedIn',
    url: 'https://linkedin.com/in/kushantest',
  }, token);
  const linkId = addLinkedinRes.body[1]._id;
  console.log(`✅ Added LinkedIn link. Link ID: ${linkId}`);

  // Update LinkedIn Link
  const updateLinkRes = await makeRequest(`http://127.0.0.1:5000/student/links/${linkId}`, 'PUT', {
    url: 'https://linkedin.com/in/kushantest-updated',
  }, token);
  console.log(`✅ Updated link URL: ${updateLinkRes.body.find(l => l._id === linkId).url}`);

  // Delete LinkedIn Link
  const deleteLinkRes = await makeRequest(`http://127.0.0.1:5000/student/links/${linkId}`, 'DELETE', null, token);
  console.log(`✅ Deleted link. Count remaining: ${deleteLinkRes.body.length}`);

  // --- ACHIEVEMENTS TESTS ---
  console.log('\n--- Testing Achievements ---');
  const addAchRes = await makeRequest('http://127.0.0.1:5000/student/achievements', 'POST', {
    title: 'Winner - National AI Hackathon',
    category: 'Hackathon',
    description: 'Secured 1st rank built autonomous agent pipeline',
    issuer: 'SSIPMT & TechCorp',
    date: 'Aug 2026',
  }, token);
  const achId = addAchRes.body[0]._id;
  console.log(`✅ Added achievement. ID: ${achId}`);

  const updateAchRes = await makeRequest(`http://127.0.0.1:5000/student/achievements/${achId}`, 'PUT', {
    title: 'Winner - National AI Hackathon (1st Place)',
  }, token);
  console.log(`✅ Updated achievement title: ${updateAchRes.body[0].title}`);

  // --- PROJECTS TESTS ---
  console.log('\n--- Testing Projects ---');
  const invalidProjectRes = await makeRequest('http://127.0.0.1:5000/student/projects', 'POST', {
    name: 'Smart Placement Portal',
    github_link: 'not-a-url',
  }, token);
  console.log(`Invalid Project GitHub URL status: ${invalidProjectRes.statusCode} (Expected: 400)`);
  if (invalidProjectRes.statusCode !== 400) throw new Error('Backend failed to validate project URL format!');

  const addProjRes = await makeRequest('http://127.0.0.1:5000/student/projects', 'POST', {
    name: 'Placement Management System',
    description: 'Full stack MERN portal with TPO approval workflow',
    technologies: 'React, Node.js, Express, MongoDB, Tailwind',
    github_link: 'https://github.com/kushantest/placify',
    live_link: 'https://placify.test.app',
  }, token);
  const projId = addProjRes.body[0]._id;
  console.log(`✅ Added project. ID: ${projId}`);

  const updateProjRes = await makeRequest(`http://127.0.0.1:5000/student/projects/${projId}`, 'PUT', {
    technologies: 'React 18, Node.js, Express, MongoDB, Vite',
  }, token);
  console.log(`✅ Updated project technologies: ${updateProjRes.body[0].technologies}`);

  // --- VERIFY MONGODB PERSISTENCE ---
  console.log('\n--- Verifying MongoDB Persistence ---');
  const profileRes = await makeRequest('http://127.0.0.1:5000/student/profile', 'GET', null, token);
  const profile = profileRes.body;

  console.log('Persisted External Links:', profile.external_links.length);
  console.log('Persisted Achievements:', profile.achievements.length);
  console.log('Persisted Projects:', profile.projects.length);

  if (profile.external_links.length !== 1 || profile.achievements.length !== 1 || profile.projects.length !== 1) {
    throw new Error('Persistent storage verification failed!');
  }

  console.log('\n🎉 ALL STUDENT PORTFOLIO & ACHIEVEMENTS CRUD TESTS PASSED SUCCESSFULLY!');
}

runPortfolioCrudTests().catch((err) => {
  console.error('Test Failed:', err);
  process.exit(1);
});
