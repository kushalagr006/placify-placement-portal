import client from '../api/client';

export const adminService = {
  // Fetch admin profile details
  getProfile: async () => {
    const response = await client.get('/admin/profile');
    return response.data;
  },

  // Update admin profile details
  updateProfile: async (profileData) => {
    const response = await client.put('/admin/profile', profileData);
    return response.data;
  },

  // Fetch all student profiles
  getStudents: async () => {
    const response = await client.get('/admin/students');
    return response.data;
  },

  // Fetch detailed profile of a student
  getStudentDetails: async (studentId) => {
    const response = await client.get(`/admin/students/${studentId}`);
    return response.data;
  },

  // Approve or Reject student registration
  updateStudentVerification: async (studentId, status) => {
    const response = await client.put(`/admin/students/${studentId}/verify`, { status });
    return response.data;
  },

  // Fetch all registered companies
  getCompanies: async () => {
    const response = await client.get('/admin/companies');
    return response.data;
  },

  // Fetch all posted jobs
  getJobs: async () => {
    const response = await client.get('/admin/jobs');
    return response.data;
  },

  // Approve or Reject job drive for TPO's college
  verifyJobDrive: async (jobId, status) => {
    const response = await client.put(`/admin/jobs/${jobId}/verify`, { status });
    return response.data;
  },

  // Create placement announcement
  createAnnouncement: async (announcementData) => {
    const response = await client.post('/admin/announcements', announcementData);
    return response.data;
  },

  // Fetch all announcements
  getAnnouncements: async () => {
    const response = await client.get('/admin/announcements');
    return response.data;
  },

  // Fetch applications targeting TPO's college students
  getApplications: async () => {
    const response = await client.get('/admin/applications');
    return response.data;
  },

  // Approve or Reject candidate selection for TPO's college
  verifyApplicationSelection: async (applicationId, status, remarks = '') => {
    const response = await client.put(`/admin/applications/${applicationId}/verify`, { status, remarks });
    return response.data;
  },

  // Delete an announcement
  deleteAnnouncement: async (id) => {
    const response = await client.delete(`/admin/announcements/${id}`);
    return response.data;
  },
};
