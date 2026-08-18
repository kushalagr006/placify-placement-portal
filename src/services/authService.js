import client from '../api/client';

export const authService = {
  // Fetch available colleges list for signup selection
  getColleges: async () => {
    const response = await client.get('/auth/colleges');
    return response.data;
  },

  // Signup user (student, company, or admin)
  signup: async ({ name, email, password, role, collegeId, branch }) => {
    const response = await client.post('/auth/signup', {
      name,
      email,
      password,
      role,
      collegeId,
      branch,
    });
    return response.data;
  },

  // Login user and return JWT access token & user metadata
  login: async ({ email, password }) => {
    const response = await client.post('/auth/login', {
      email,
      password,
    });

    const { access_token, role, user_id, name } = response.data;

    // Persist token and session data
    localStorage.setItem('token', access_token);
    localStorage.setItem('role', role);
    localStorage.setItem(
      'user',
      JSON.stringify({ id: user_id, email, name: name || '', role })
    );

    return response.data;
  },

  // Fetch currently authenticated user using JWT token
  getMe: async () => {
    const response = await client.get('/auth/me');
    return response.data;
  },

  // Delete requesting user's account and profile
  deleteAccount: async () => {
    const response = await client.delete('/auth/account');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    return response.data;
  },

  // Logout user and clear local session state
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  },

  // Helper to check current authentication status
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!token || !userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};
