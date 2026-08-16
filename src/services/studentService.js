import client from '../api/client';

export const studentService = {
  // Fetch active job postings
  getJobs: async () => {
    const response = await client.get('/student/jobs');
    return response.data;
  },

  // Submit job application
  applyJob: async (jobId) => {
    const response = await client.post(`/student/jobs/${jobId}/apply`);
    return response.data;
  },

  // Fetch applications submitted by student
  getApplications: async () => {
    const response = await client.get('/student/applications');
    return response.data;
  },

  // Fetch broadcasted placement announcements for student
  getAnnouncements: async () => {
    const response = await client.get('/student/announcements');
    return response.data;
  },

  // Fetch student profile details
  getProfile: async () => {
    const response = await client.get('/student/profile');
    return response.data;
  },

  // Create or update student profile
  updateProfile: async (profileData) => {
    const response = await client.put('/student/profile', profileData);
    return response.data;
  },

  // Re-apply for verification after rejection
  reapplyVerification: async (data) => {
    const response = await client.post('/student/reapply-verification', data);
    return response.data;
  },

  // Upload PDF resume file
  uploadResume: async (formData) => {
    const response = await client.post('/student/resume/upload', formData, {
      headers: {
        'Content-Type': undefined,
      },
    });
    return response.data;
  },

  // External Links CRUD
  addLink: async (data) => {
    const response = await client.post('/student/links', data);
    return response.data;
  },
  updateLink: async (linkId, data) => {
    const response = await client.put(`/student/links/${linkId}`, data);
    return response.data;
  },
  deleteLink: async (linkId) => {
    const response = await client.delete(`/student/links/${linkId}`);
    return response.data;
  },

  // Achievements CRUD
  addAchievement: async (data) => {
    const response = await client.post('/student/achievements', data);
    return response.data;
  },
  updateAchievement: async (achievementId, data) => {
    const response = await client.put(`/student/achievements/${achievementId}`, data);
    return response.data;
  },
  deleteAchievement: async (achievementId) => {
    const response = await client.delete(`/student/achievements/${achievementId}`);
    return response.data;
  },

  // Projects CRUD
  addProject: async (data) => {
    const response = await client.post('/student/projects', data);
    return response.data;
  },
  updateProject: async (projectId, data) => {
    const response = await client.put(`/student/projects/${projectId}`, data);
    return response.data;
  },
  deleteProject: async (projectId) => {
    const response = await client.delete(`/student/projects/${projectId}`);
    return response.data;
  },
};
