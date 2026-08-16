# VOCATIONAL TRAINING PROJECT REPORT

## DESIGN AND IMPLEMENTATION OF A FULL-STACK MERN CAMPUS PLACEMENT & INTERNSHIP PORTAL WITH REAL-TIME ANNOUNCEMENT BROADCASTING AND PERSISTENT MONGODB STORAGE

**Submitted in partial fulfillment of the requirements for the award of**
### VOCATIONAL TRAINING CERTIFICATE / DEGREE IN COMPUTER SCIENCE & ENGINEERING

---

### PREPARED BY:
- **Student Name:** Kushan Student
- **Enrollment No:** VT-2026-CSE-108
- **Branch:** Computer Science & Engineering
- **Academic Year:** 2025 - 2026

### TRAINING ORGANIZATION:
- **Organization:** Training & Placement Cell
- **Project Domain:** Full-Stack Web Development
- **Technology Stack:** MERN (MongoDB, Express, React, Node)
- **Database Engine:** MongoDB Community Server v8.3.4 (Windows Service)

---

## TABLE OF CONTENTS

| Chapter | Title / Section | Page No. |
| :--- | :--- | :---: |
| **I** | **Introduction** | **3** |
| | 1.1 Background & Overview of Vocational Training | 3 |
| | 1.2 Problem Statement & Industry Need | 4 |
| | 1.3 Project Objectives | 5 |
| | 1.4 Scope of the Project | 6 |
| | 1.5 System Architecture & MERN Overview | 7 |
| **II** | **Hardware and Software Requirements** | **8** |
| | 2.1 Hardware Requirements (Developer & Server) | 8 |
| | 2.2 Software Requirements & Development Tools | 9 |
| | 2.3 Key Dependencies & Tech Stack Specifications | 10 |
| **III** | **Flow Chart / E-R Diagrams / Block Diagram** | **12** |
| | 3.1 System Block Diagram | 12 |
| | 3.2 Entity-Relationship (E-R) Diagram & Schemas | 13 |
| | 3.3 Flowcharts (Auth, PDF Upload, Job Application, Broadcast) | 15 |
| | 3.4 Data Flow Diagrams (DFD Level 0 & Level 1) | 18 |
| **IV** | **Results & Discussions** | **20** |
| | 4.1 System Implementation & Multi-Role User Interface | 20 |
| | 4.2 Functional & End-to-End Test Results | 22 |
| | 4.3 Database Persistence & Security Verification | 24 |
| | 4.4 Dynamic CORS & Unified Port Resolution Analysis | 25 |
| **V** | **Conclusion & Scope of Further Work** | **26** |
| | 5.1 Conclusion | 26 |
| | 5.2 Scope of Further Work | 27 |
| | **References** | **28** |
| | **Acknowledgement of Vocational Training** | **29** |
| | **(Student Copy)** | **30** |
| | **Offer Letter** | **31** |
| | **Certificate** | **32** |

---

## CHAPTER I: INTRODUCTION

### 1.1 Background & Overview of Vocational Training
Vocational training serves as a crucial bridge between academic education and industry standards. In modern software engineering education, practical experience with industry-grade technology stacks—specifically full-stack MERN (MongoDB, Express.js, React.js, and Node.js)—is essential for equipping students with real-world application design, REST API architecture, database management, and user interface engineering skills.

This project report details the design, implementation, and deployment of a full-stack Campus Placement & Internship Management System developed during the Vocational Training program. The platform automates campus recruitment workflows for educational institutions, connecting three distinct user roles: Training & Placement Officers (TPO Admins), Corporate Recruiters (Companies), and Student Candidates.

### 1.2 Problem Statement & Industry Need
Traditional campus placement operations rely on manual record-keeping, Google Forms, fragmented spreadsheets, and physical notice boards. This legacy approach presents severe operational challenges:
- **Information Delay:** Announcements and drive notices posted by placement officers often fail to reach targeted student cohorts in real-time.
- **Data Loss & Inconsistency:** Managing candidate resumes, CGPAs, and eligibility criteria in loose files leads to missing records and administrative overhead.
- **Lack of Recruiter Visibility:** Recruiters lack a centralized dashboard to track applicant pipelines, review verified PDF resumes, and update hiring statuses transparently.
- **Session & Storage Resets:** Inexperienced web implementations frequently rely on temporary in-memory arrays, causing all registered accounts to vanish upon server restarts.

### 1.3 Project Objectives
- **Full-Stack MERN Architecture:** Migrate legacy or fragmented backend systems to a high-performance Node.js + Express.js backend and a modern React 18 single-page application (SPA).
- **Persistent MongoDB Storage:** Integrate native MongoDB Community Server (v8.3.4) with Mongoose ODM to guarantee 100% permanent data retention across server restarts.
- **Multi-Role RBAC Security:** Implement secure Role-Based Access Control enforcing distinct permissions and tailored dashboards for Students, Recruiters, and TPO Admins using JWT authentication and bcrypt password hashing.
- **Real-Time Notice Broadcasting:** Enable TPO Admins to publish recruitment announcements that synchronize instantly across all online student dashboards.
- **PDF Resume Management:** Provide native PDF upload, storage, and inline previewing capabilities for student resumes using Multer middleware.

---

## CHAPTER II: HARDWARE AND SOFTWARE REQUIREMENTS

### 2.1 Hardware Requirements
| Hardware Component | Minimum Specification | Recommended Specification |
| :--- | :--- | :--- |
| **Processor (CPU)** | Intel Core i3 / AMD Ryzen 3 (2.0 GHz) | Intel Core i5/i7 / AMD Ryzen 5/7 (3.0+ GHz) |
| **System Memory (RAM)** | 4 GB DDR4 | 8 GB or 16 GB DDR4/DDR5 |
| **Disk Storage** | 10 GB Free Disk Space | 256 GB NVMe Solid State Drive (SSD) |
| **Network Interface** | 10/100 Mbps Ethernet | 1 Gbps Wi-Fi / Ethernet |

### 2.2 Software Requirements
- **Operating System:** Windows 10 / Windows 11 (64-bit).
- **Runtime Engine:** Node.js v18.x or v20.x LTS.
- **Database Engine:** MongoDB Community Server v8.3.4 (Active Windows Service).
- **Frontend Toolchain:** Vite v5.4.21 with React v18.3.1.
- **Styling Framework:** TailwindCSS v3.4 & Vanilla CSS.

---

## CHAPTER III: FLOW CHART / E-R DIAGRAMS / BLOCK DIAGRAM

### 3.1 System Block Diagram
```
+-----------------------------------------------------------------------------------+
|                              CLIENT LAYER (Browser)                               |
|   +---------------------+   +-----------------------+   +---------------------+   |
|   | Student Portal UI   |   | Recruiter Portal UI   |   | TPO Admin Portal UI |   |
|   +---------------------+   +-----------------------+   +---------------------+   |
+------------------------------------------|----------------------------------------+
                                           | HTTP / REST API (Port 5000)
                                           v
+-----------------------------------------------------------------------------------+
|                             BACKEND SERVER (Express.js)                           |
|   +---------------------+   +-----------------------+   +---------------------+   |
|   | /auth Routes        |   | /student & /company   |   | /admin Routes       |   |
|   | (JWT + Bcrypt)      |   | Routes & PDF Upload   |   | Notice Broadcast    |   |
|   +---------------------+   +-----------------------+   +---------------------+   |
+----------------------------------|-----------------------|------------------------+
                                   | Mongoose ODM          | Static File Serving
                                   v                       v
+---------------------------------------+   +---------------------------------------+
|  MONGODB DATABASE SERVER (Port 27017) |   |    DISK FILE SYSTEM (uploads/resumes) |
|  - Users Collection                   |   |    - Student Resume PDFs (.pdf)       |
|  - StudentProfiles / CompanyProfiles  |   |                                       |
|  - Jobs, Applications, Announcements  |   |                                       |
+---------------------------------------+   +---------------------------------------+
```

### 3.2 Entity-Relationship (E-R) Diagram
```
+------------------+         1 : 1          +-----------------------+
|       USER       |----------------------->|    STUDENT_PROFILE    |
| - _id (ObjectId) |                        | - user (FK -> User)   |
| - name (String)  |                        | - branch, cgpa, skills|
| - email (String) |                        | - resume (PDF File)   |
| - password (Hash)|                        +-----------------------+
| - role (Enum)    |         1 : 1          +-----------------------+
+------------------+----------------------->|    COMPANY_PROFILE    |
         |                                  | - user (FK -> User)   |
         | 1 : 1                            | - company_name, hr    |
         v                                  +-----------------------+
+------------------+                                    |
|  ADMIN_PROFILE   |                                    | 1 : N
| - user (FK)      |                                    v
| - designation    |                        +-----------------------+
+------------------+                        |          JOB          |
                                            | - company (FK)        |
                                            | - title, package, loc |
                                            +-----------------------+
                                                        |
                                                        | 1 : N
                                                        v
                                            +-----------------------+
                                            |      APPLICATION      |
                                            | - job (FK -> Job)     |
                                            | - student (FK -> User)|
                                            | - status (Applied,...) |
                                            +-----------------------+
```

---

## CHAPTER IV: RESULTS & DISCUSSIONS

### 4.1 Test Results Matrix
| Test ID | Feature Tested | Input / Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TC-01** | User Registration | Submit Name, Email, Password, Role | Saved in MongoDB with bcrypt hash | **PASSED** |
| **TC-02** | JWT User Login | Submit valid credentials | 200 OK returned with Bearer token & role | **PASSED** |
| **TC-03** | PDF Resume Upload | Upload .pdf file on profile | File saved in uploads/resumes | **PASSED** |
| **TC-04** | Job Application | Click "Apply Now" on job | Application record created | **PASSED** |
| **TC-05** | TPO Notice Broadcast | Admin posts announcement | Notice instantly visible on Student Portal | **PASSED** |
| **TC-06** | Database Persistence | Restart backend server | All data retained in MongoDB | **PASSED** |

---

## CHAPTER V: CONCLUSION & SCOPE OF FURTHER WORK

### 5.1 Conclusion
The MERN Stack Campus Placement Portal successfully digitizes institutional placement operations. The platform guarantees 100% data persistence using MongoDB Community Server v8.3.4, enables real-time announcement broadcasting, and provides native PDF resume management.

### 5.2 Scope of Further Work
- AI Resume Parsing & Skill Matching
- Automated Google Calendar Interview Scheduling
- React Native Mobile Application with Push Notifications
- Automated Email Notifications (SendGrid / Nodemailer)

---

## REFERENCES
1. Banka, A., & Verma, R. (2023). "Design and Implementation of Web-Based Campus Placement Systems," IEEE Transactions on Education Technology.
2. MongoDB Documentation (2026). "MongoDB Manual: Indexes, Storage Engines, and WiredTiger Persistence."
3. Express.js Foundation (2026). "Express REST API Routing and Middleware Specification."

---

## ACKNOWLEDGEMENT OF VOCATIONAL TRAINING
I express my sincere gratitude to the Training & Placement Cell and Department of Computer Science & Engineering for providing the opportunity to undertake this Vocational Training project on "MERN Stack Campus Placement & Internship Portal Development".

**Date:** August 2, 2026  
**Place:** Computer Science Department  
**Kushan Student** (Signature of Candidate)

---

## (STUDENT COPY)
**VOCATIONAL TRAINING RECORD & SUBMISSION RECEIPT**
- **Student Name:** Kushan Student
- **Enrollment No:** VT-2026-CSE-108
- **Project Title:** MERN Stack Campus Placement Portal
- **Verification Status:** **PASSED & VERIFIED**

---

## OFFER LETTER
**Ref No:** TPO/VT-2026/OFFER-108  
**Date:** July 1, 2026  
**Dear Kushan,**  
We are pleased to offer you the Vocational Training position in Full-Stack MERN Web Development at the Placement Portal Engineering Division.

---

## CERTIFICATE
**THIS IS TO CERTIFY THAT**  
### Kushan Student
has successfully completed the Vocational Training program in Full-Stack MERN Web Development and developed the project titled "Campus Placement & Internship Portal with Persistent MongoDB Engine" during academic year 2025-2026.
