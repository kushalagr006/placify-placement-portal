import client from '../api/client';

export const companyService = {
  // Create a new job posting
  createJob: async (jobData) => {
    const response = await client.post('/company/jobs', jobData);
    return response.data;
  },

  // Fetch jobs posted by current company
  getCompanyJobs: async () => {
    const response = await client.get('/company/jobs');
    return response.data;
  },

  // Update job posting
  updateJob: async (jobId, jobData) => {
    const response = await client.put(`/company/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Delete job posting
  deleteJob: async (jobId) => {
    const response = await client.delete(`/company/jobs/${jobId}`);
    return response.data;
  },

  // Fetch all student applications submitted to any job posted by this company
  getAllApplications: async () => {
    const response = await client.get('/company/applications');
    return response.data;
  },

  // Fetch student applications for a specific job
  getJobApplications: async (jobId) => {
    const response = await client.get(`/company/jobs/${jobId}/applications`);
    return response.data;
  },

  // Fetch detailed profile of an applicant student
  getApplicantDetails: async (studentId) => {
    const response = await client.get(`/company/students/${studentId}`);
    return response.data;
  },

  // Update candidate application status
  updateApplicationStatus: async (applicationId, status, remarks = '') => {
    const response = await client.put(`/company/applications/${applicationId}/status`, {
      status,
      remarks,
    });
    return response.data;
  },

  // Fetch company profile details
  getProfile: async () => {
    const response = await client.get('/company/profile');
    return response.data;
  },

  // Create or update company profile
  updateProfile: async (profileData) => {
    const response = await client.put('/company/profile', profileData);
    return response.data;
  },
};
