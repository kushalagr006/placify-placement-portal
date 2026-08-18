import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { studentService } from '../services/studentService';
import { companyService } from '../services/companyService';
import { adminService } from '../services/adminService';

const PortalContext = createContext();

export const PortalProvider = ({ children }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeRole, setActiveRole] = useState('student'); // 'student' | 'recruiter' ('company') | 'admin'

  // Navigation State
  const [activeTab, setActiveTab] = useState('explore');

  // Live Data States
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  // UI Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Modals State
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [minPackage, setMinPackage] = useState(0);

  // Map backend role to frontend activeRole state
  const mapRole = (role) => {
    if (role === 'company') return 'recruiter';
    return role;
  };

  // Logout handler
  const logout = useCallback(() => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setJobs([]);
    setMyApplications([]);
    setAnnouncements([]);
    setStudents([]);
    setCompanies([]);
    setStudentProfile(null);
    setCompanyProfile(null);
    setAdminProfile(null);
  }, []);

  // Fetch data based on active authenticated role
  const refreshPortalData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setApiError(null);

    try {
      // 1. Validate JWT token and fetch authenticated user details
      const me = await authService.getMe();
      if (!me) {
        logout();
        return;
      }
      setCurrentUser(me);
      setIsLoggedIn(true);
      setActiveRole(mapRole(me.role));

      // 2. Fetch role-specific backend data
      const currentRole = me.role;

      if (currentRole === 'student') {
        const [jobsData, appsData, announcementsData] = await Promise.allSettled([
          studentService.getJobs(),
          studentService.getApplications(),
          studentService.getAnnouncements(),
        ]);
        if (jobsData.status === 'fulfilled') setJobs(jobsData.value || []);
        if (appsData.status === 'fulfilled') setMyApplications(appsData.value || []);
        if (announcementsData.status === 'fulfilled') setAnnouncements(announcementsData.value || []);

        try {
          const profile = await studentService.getProfile();
          setStudentProfile(profile);
        } catch {
          setStudentProfile(null);
        }
      } else if (currentRole === 'company') {
        const [jobsData, appsData, profileData] = await Promise.allSettled([
          companyService.getCompanyJobs(),
          companyService.getAllApplications(),
          companyService.getProfile(),
        ]);

        if (jobsData.status === 'fulfilled') setJobs(jobsData.value || []);
        if (appsData.status === 'fulfilled') setMyApplications(appsData.value || []);
        if (profileData.status === 'fulfilled') setCompanyProfile(profileData.value || null);
      } else if (currentRole === 'admin') {
        const [studentsData, companiesData, jobsData, announcementsData, profileData, appsData] =
          await Promise.allSettled([
            adminService.getStudents(),
            adminService.getCompanies(),
            adminService.getJobs(),
            adminService.getAnnouncements(),
            adminService.getProfile(),
            adminService.getApplications(),
          ]);

        if (studentsData.status === 'fulfilled') setStudents(studentsData.value || []);
        if (companiesData.status === 'fulfilled') setCompanies(companiesData.value || []);
        if (jobsData.status === 'fulfilled') setJobs(jobsData.value || []);
        if (announcementsData.status === 'fulfilled')
          setAnnouncements(announcementsData.value || []);
        if (profileData.status === 'fulfilled') setAdminProfile(profileData.value || null);
        if (appsData.status === 'fulfilled') setMyApplications(appsData.value || []);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        setApiError(err.response?.data?.detail || 'Failed to sync portal data with server');
      }
    }
  }, [logout]);

  // Restore authenticated session on mount and validate JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshPortalData();
    } else {
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  }, [refreshPortalData]);

  // Fast Instant Login handler
  const loginWithCredentials = async (email, password) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const data = await authService.login({ email, password });
      const mappedRole = mapRole(data.role);

      setCurrentUser({
        id: data.user_id,
        email,
        name: data.name || email.split('@')[0],
        role: data.role,
      });
      setActiveRole(mappedRole);
      setActiveTab('explore');

      // Await initial profile sync before showing dashboard to avoid UI verification status flash
      await refreshPortalData();
      setIsLoggedIn(true);
      setIsLoading(false);
      return { success: true, user: data };
    } catch (err) {
      setIsLoading(false);
      const msg =
        err.response?.data?.detail ||
        (err.code === 'ECONNABORTED' || err.message?.includes('timeout')
          ? 'Server response timed out. Please check if backend is running on port 5000.'
          : err.message?.includes('Network Error')
          ? 'Cannot connect to backend server. Please start node backend_node/server.js.'
          : 'Login failed. Please check credentials.');
      return { success: false, message: msg };
    }
  };

  // Student Actions
  const applyForJob = async (job) => {
    try {
      const app = await studentService.applyJob(job.job_id || job.id);
      setMyApplications((prev) => [app, ...prev]);
      await refreshPortalData();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Application failed',
      };
    }
  };

  const updateStudentProfile = async (profileData) => {
    try {
      const updated = await studentService.updateProfile(profileData);
      setStudentProfile(updated);
      await refreshPortalData();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Profile update failed',
      };
    }
  };

  // Company Actions
  const addNewJob = async (jobData) => {
    try {
      const newJob = await companyService.createJob({
        title: jobData.title,
        description: jobData.description || 'Job posting',
        package: jobData.package || jobData.stipend || 'Competitive',
        location: jobData.location || 'Remote/Onsite',
        eligibility: jobData.eligibility || 'Min 7.0 CGPA',
        deadline: jobData.deadline || new Date().toISOString().split('T')[0],
        colleges: jobData.colleges || [],
        branches: jobData.branches || [],
      });
      setJobs((prev) => [newJob, ...prev]);
      await refreshPortalData();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Job creation failed',
      };
    }
  };

  const updateCandidateStatus = async (appId, newStatus, remarks = '') => {
    try {
      const updatedApp = await companyService.updateApplicationStatus(appId, newStatus, remarks);
      setMyApplications((prev) =>
        prev.map((app) => (app.application_id === appId || app.id === appId ? { ...app, ...updatedApp } : app))
      );
      await refreshPortalData();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Status update failed',
      };
    }
  };

  const updateCompanyProfile = async (profileData) => {
    try {
      const updated = await companyService.updateProfile(profileData);
      setCompanyProfile(updated);
      await refreshPortalData();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Company profile update failed',
      };
    }
  };

  // Admin Actions
  const updateAdminProfile = async (profileData) => {
    try {
      const updated = await adminService.updateProfile(profileData);
      setAdminProfile(updated);
      if (updated.name && currentUser) {
        setCurrentUser((prev) => ({ ...prev, name: updated.name }));
      }
      await refreshPortalData();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Admin profile update failed',
      };
    }
  };

  const createAnnouncement = async (title, description) => {
    try {
      const created = await adminService.createAnnouncement({ title, description });
      const formattedCreated = {
        announcement_id: created.announcement_id || created.id,
        id: created.announcement_id || created.id,
        title: created.title,
        description: created.description,
        created_at: created.created_at || created.createdAt || new Date().toISOString(),
      };
      setAnnouncements((prev) => [formattedCreated, ...prev]);
      await refreshPortalData();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Announcement creation failed',
      };
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await adminService.deleteAnnouncement(id);
      setAnnouncements((prev) =>
        prev.filter((a) => (a.announcement_id || a.id) !== id)
      );
      await refreshPortalData();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Deletion failed',
      };
    }
  };

  const toggleBookmark = (jobId) => {
    setBookmarks((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    );
  };

  const verifyStudent = async (studentId, status) => {
    try {
      const updated = await adminService.updateStudentVerification(studentId, status);
      setStudents((prev) =>
        prev.map((s) => {
          const sId = s.student_id || s.id;
          const uId = s.user_id || s.user?.id;
          if (
            sId === studentId ||
            sId === updated.student_id ||
            uId === studentId ||
            uId === updated.user_id
          ) {
            return { ...s, verification_status: status };
          }
          return s;
        })
      );
      await refreshPortalData();
      return { success: true, updated };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Verification update failed',
      };
    }
  };

  const reapplyStudentVerification = async (data) => {
    try {
      const updated = await studentService.reapplyVerification(data);
      setStudentProfile(updated);
      await refreshPortalData();
      return { success: true, updated };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Failed to submit re-application',
      };
    }
  };

  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
      logout();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Failed to delete account',
      };
    }
  };

  const verifyJobDrive = async (jobId, status) => {
    try {
      const res = await adminService.verifyJobDrive(jobId, status);
      setJobs((prev) =>
        prev.map((j) => {
          const jId = j.job_id || j.id;
          if (jId === jobId) {
            return { ...j, tpo_status: status };
          }
          return j;
        })
      );
      await refreshPortalData();
      return { success: true, res };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.detail || 'Job drive verification failed',
      };
    }
  };

  const addStudentLink = async (data) => {
    try {
      const updated = await studentService.addLink(data);
      setStudentProfile((prev) => ({ ...prev, external_links: updated }));
      await refreshPortalData();
      return { success: true, updated };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to add link' };
    }
  };

  const updateStudentLink = async (linkId, data) => {
    try {
      const updated = await studentService.updateLink(linkId, data);
      setStudentProfile((prev) => ({ ...prev, external_links: updated }));
      await refreshPortalData();
      return { success: true, updated };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to update link' };
    }
  };

  const deleteStudentLink = async (linkId) => {
    try {
      const updated = await studentService.deleteLink(linkId);
      setStudentProfile((prev) => ({ ...prev, external_links: updated }));
      await refreshPortalData();
      return { success: true, updated };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to delete link' };
    }
  };

  const addStudentAchievement = async (data) => {
    try {
      const updated = await studentService.addAchievement(data);
      setStudentProfile((prev) => ({ ...prev, achievements: updated }));
      await refreshPortalData();
      return { success: true, updated };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to add achievement' };
    }
  };

  const updateStudentAchievement = async (achievementId, data) => {
    try {
      const updated = await studentService.updateAchievement(achievementId, data);
      setStudentProfile((prev) => ({ ...prev, achievements: updated }));
      await refreshPortalData();
      return { success: true, updated };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to update achievement' };
    }
  };

  const deleteStudentAchievement = async (achievementId) => {
    try {
      const updated = await studentService.deleteAchievement(achievementId);
      setStudentProfile((prev) => ({ ...prev, achievements: updated }));
      await refreshPortalData();
      return { success: true, updated };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to delete achievement' };
    }
  };

  const addStudentProject = async (data) => {
    try {
      const updated = await studentService.addProject(data);
      setStudentProfile((prev) => ({ ...prev, projects: updated }));
      await refreshPortalData();
      return { success: true, updated };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to add project' };
    }
  };

  const updateStudentProject = async (projectId, data) => {
    try {
      const updated = await studentService.updateProject(projectId, data);
      setStudentProfile((prev) => ({ ...prev, projects: updated }));
      await refreshPortalData();
      return { success: true, updated };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to update project' };
    }
  };

  const deleteStudentProject = async (projectId) => {
    try {
      const updated = await studentService.deleteProject(projectId);
      setStudentProfile((prev) => ({ ...prev, projects: updated }));
      await refreshPortalData();
      return { success: true, updated };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to delete project' };
    }
  };

  const verifyCandidateSelection = async (applicationId, status, remarks = '') => {
    try {
      const res = await adminService.verifyApplicationSelection(applicationId, status, remarks);
      setMyApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId || app.application_id === applicationId
            ? { ...app, status: res.status, status_history: res.status_history }
            : app
        )
      );
      return { success: true, status: res.status };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Failed to update selection approval status' };
    }
  };

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        activeRole,
        setActiveRole,
        activeTab,
        setActiveTab,
        isLoading,
        apiError,
        loginWithCredentials,
        logout,
        jobs,
        setJobs,
        myApplications,
        setMyApplications,
        announcements,
        setAnnouncements,
        students,
        companies,
        studentProfile,
        companyProfile,
        adminProfile,
        bookmarks,
        toggleBookmark,
        selectedJob,
        setSelectedJob,
        applyModalJob,
        setApplyModalJob,
        isPostJobModalOpen,
        setIsPostJobModalOpen,
        searchQuery,
        setSearchQuery,
        selectedType,
        setSelectedType,
        selectedMode,
        setSelectedMode,
        selectedBranch,
        setSelectedBranch,
        minPackage,
        setMinPackage,
        applyForJob,
        addNewJob,
        updateCandidateStatus,
        updateStudentProfile,
        updateCompanyProfile,
        updateAdminProfile,
        verifyStudent,
        reapplyStudentVerification,
        verifyJobDrive,
        verifyCandidateSelection,
        deleteAccount,
        addStudentLink,
        updateStudentLink,
        deleteStudentLink,
        addStudentAchievement,
        updateStudentAchievement,
        deleteStudentAchievement,
        addStudentProject,
        updateStudentProject,
        deleteStudentProject,
        createAnnouncement,
        deleteAnnouncement,
        refreshPortalData,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => useContext(PortalContext);
