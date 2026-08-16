# 🎓 Placify — Campus Placement & Internship Portal

> A modern, multi-tenant MERN stack platform connecting Students, Employers, and Training & Placement Officers (TPO) for seamless campus recruitment.

---

## 🌟 Key Features

### 🎓 Student Portal
- **Job & Internship Discovery**: Browse active campus recruitment drives with real-time filtering.
- **1-Click Application Pipeline**: Submit job applications with automatic profile & resume linkage.
- **Application Tracking & Rejection Feedback**: Real-time status badges with detailed rejection feedback callouts from Recruiters and TPO Officers.
- **Student Profile Management**: Manage CGPA, academic branch, skills, phone number, and resume documents.

### 🏢 Recruiter / Company Portal
- **Job Drive Management**: Post, update, and manage job drives with package, location, and eligibility criteria.
- **Applicant Review Table**: View candidate profiles, verify PDF resumes, and filter by branch or CGPA.
- **Interactive Candidate Selection & Rejection**: Shortlist candidates or reject applications with custom feedback modals. Single-click protection prevents duplicate submissions.

### 🏛️ TPO Admin Portal
- **College Placement Verification**: Verify and approve recruiter candidate selections before final offer letters.
- **Multi-Tenant College Isolation**: Dedicated data partitioning for campus drives, students, and announcements.
- **Campus Announcements**: Post real-time announcements to students and recruiters.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Context API.
- **Backend**: Node.js, Express.js 5, MongoDB, Mongoose ORM, JSON Web Tokens (JWT), Bcrypt password hashing.
- **Storage**: Persistent Disk Storage Engine / MongoDB Memory Server with local resume upload handling.

---

## 🚀 Quick Start & Installation

### 1. Clone Repository
```bash
git clone https://github.com/kushalagr006/placify-placement-portal.git
cd placify-placement-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Application
Run the frontend and backend server commands:

```bash
# Terminal 1: Start Frontend Dev Server
npm run dev

# Terminal 2: Start Backend Node.js API Server
npm run backend
```

---

## 🔑 Demo Test Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **🏛️ TPO Admin** | `ad@ssipmt.com` | `kushal1234` |
| **🏢 Recruiter** | `recruiter@vtportal.com` | `recruiter123` |
| **🎓 Student** | `stucse@ssipmt.com` | `kushal1234` |

---

## 🔒 License & Copyright

**Copyright © 2026 Kushal. All Rights Reserved.**

This repository and its source code are **Proprietary**. Unauthorized copying, modification, redistribution, or commercial use of this codebase without explicit written permission is strictly prohibited.
