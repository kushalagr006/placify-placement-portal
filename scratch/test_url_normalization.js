import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';

async function runTest() {
  console.log('Testing Automatic URL Normalization (Adding https://)...');
  const timestamp = Date.now();

  const collegesRes = await axios.get(`${BASE_URL}/auth/colleges`);
  const college = collegesRes.data[0];

  await axios.post(`${BASE_URL}/auth/signup`, {
    name: `URL Test Student ${timestamp}`,
    email: `urltest_${timestamp}@ssipmt.com`,
    password: 'password123',
    role: 'student',
    collegeId: college._id,
    branch: 'Computer Science & Engineering',
  });

  const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
    email: `urltest_${timestamp}@ssipmt.com`,
    password: 'password123',
    role: 'student',
  });
  const token = loginRes.data.access_token;

  // 1. Add External Link without https:// prefix
  const linkRes = await axios.post(
    `${BASE_URL}/student/links`,
    { title: 'GitHub', url: 'github.com/kushal-test' },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('✅ Added link without https:// prefix:', linkRes.data);
  const addedLink = linkRes.data.find((l) => l.title === 'GitHub');
  if (addedLink.url !== 'https://github.com/kushal-test') {
    throw new Error(`Expected 'https://github.com/kushal-test', got '${addedLink.url}'`);
  }

  // 2. Add Project without https:// prefix
  const projRes = await axios.post(
    `${BASE_URL}/student/projects`,
    {
      name: 'E-Commerce Platform',
      description: 'Full stack online shop',
      technologies: 'React, Node.js',
      github_link: 'github.com/kushal/ecommerce',
      live_link: 'my-shop.vercel.app',
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('✅ Added project without https:// prefix:', projRes.data);
  const addedProj = projRes.data.find((p) => p.name === 'E-Commerce Platform');
  if (addedProj.github_link !== 'https://github.com/kushal/ecommerce') {
    throw new Error(`Expected GitHub link 'https://github.com/kushal/ecommerce', got '${addedProj.github_link}'`);
  }
  if (addedProj.live_link !== 'https://my-shop.vercel.app') {
    throw new Error(`Expected Live link 'https://my-shop.vercel.app', got '${addedProj.live_link}'`);
  }

  console.log('\n🎉 AUTOMATIC URL NORMALIZATION TEST PASSED SUCCESSFULLY!\n');
}

runTest().catch((err) => {
  console.error('❌ TEST FAILED:', err.response?.data || err.message);
  process.exit(1);
});
