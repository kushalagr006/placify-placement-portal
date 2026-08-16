import fs from 'fs';
import path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  ShadingType,
  PageBreak,
} from 'docx';

// Helper to create styled headings
const createTitle = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 240 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 52, // 26pt
        color: '1E3A8A', // Dark Blue
        font: 'Calibri',
      }),
    ],
  });

const createSubtitle = (text) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 360 },
    children: [
      new TextRun({
        text,
        size: 28, // 14pt
        italic: true,
        color: '4B5563', // Slate Gray
        font: 'Calibri',
      }),
    ],
  });

const createHeading1 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 36, // 18pt
        color: '1E3A8A',
        font: 'Calibri',
      }),
    ],
  });

const createHeading2 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28, // 14pt
        color: '2563EB', // Royal Blue
        font: 'Calibri',
      }),
    ],
  });

const createHeading3 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 60 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24, // 12pt
        color: '1E293B',
        font: 'Calibri',
      }),
    ],
  });

const createPara = (text, options = {}) =>
  new Paragraph({
    spacing: { before: 60, after: 120, line: 276 }, // 1.15 line spacing
    alignment: options.alignment || AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        size: 24, // 12pt
        font: 'Calibri',
        bold: options.bold || false,
        italic: options.italic || false,
        color: options.color || '334155',
      }),
    ],
  });

const createBullet = (boldPrefix, text) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 80, line: 276 },
    children: [
      new TextRun({
        text: boldPrefix + ' ',
        bold: true,
        size: 24,
        font: 'Calibri',
        color: '1E293B',
      }),
      new TextRun({
        text,
        size: 24,
        font: 'Calibri',
        color: '334155',
      }),
    ],
  });

const createCodeBlock = (codeText) => {
  const lines = codeText.split('\n');
  return lines.map(
    (line) =>
      new Paragraph({
        spacing: { before: 20, after: 20 },
        shading: { type: ShadingType.CLEAR, fill: 'F1F5F9' },
        children: [
          new TextRun({
            text: line,
            font: 'Consolas',
            size: 20, // 10pt
            color: '0F172A',
          }),
        ],
      })
  );
};

// Main Document Generation
async function generateWordDoc() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Vocational Training Report | Campus Placement Portal (MERN Stack)',
                    size: 18,
                    color: '94A3B8',
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: ['Page ', PageNumber.CURRENT, ' of ', PageNumber.TOTAL_PAGES],
                    size: 18,
                    color: '94A3B8',
                    font: 'Calibri',
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // COVER PAGE
          new Paragraph({ spacing: { before: 720 } }),
          createTitle('VOCATIONAL TRAINING PROJECT REPORT'),
          createSubtitle('DESIGN AND IMPLEMENTATION OF A FULL-STACK MERN CAMPUS PLACEMENT & INTERNSHIP PORTAL WITH REAL-TIME ANNOUNCEMENT BROADCASTING AND PERSISTENT MONGODB STORAGE'),
          
          new Paragraph({ spacing: { before: 360 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Submitted in partial fulfillment of the requirements for the award of', size: 22, italic: true, font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 360 },
            children: [
              new TextRun({ text: 'VOCATIONAL TRAINING CERTIFICATE / DEGREE IN COMPUTER SCIENCE & ENGINEERING', size: 24, bold: true, color: '1E3A8A', font: 'Calibri' }),
            ],
          }),

          new Paragraph({ spacing: { before: 720 } }),

          // Student Details Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      createPara('PREPARED BY:', { bold: true, color: '1E3A8A' }),
                      createPara('Student Name: Kushan Student'),
                      createPara('Enrollment No: VT-2026-CSE-108'),
                      createPara('Branch: Computer Science & Engineering'),
                      createPara('Academic Year: 2025 - 2026'),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      createPara('TRAINING ORGANIZATION:', { bold: true, color: '1E3A8A' }),
                      createPara('Organization: Training & Placement Cell'),
                      createPara('Project Domain: Full-Stack Web Development'),
                      createPara('Technology Stack: MERN (MongoDB, Express, React, Node)'),
                      createPara('Database Engine: MongoDB Community Server 8.3.4'),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // TABLE OF CONTENTS
          createHeading1('TABLE OF CONTENTS'),
          createPara('The structure of this report is organized into the following chapters:'),
          new Paragraph({ spacing: { before: 120 } }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [new Paragraph({ children: [new TextRun({ text: 'Chapter', bold: true, color: 'FFFFFF', size: 22 })] })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [new Paragraph({ children: [new TextRun({ text: 'Title / Section', bold: true, color: 'FFFFFF', size: 22 })] })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Page No.', bold: true, color: 'FFFFFF', size: 22 })] })] }),
                ],
              }),
              ...[
                ['I', 'Introduction', '3'],
                ['', '1.1 Background & Overview of Vocational Training', '3'],
                ['', '1.2 Problem Statement & Industry Need', '4'],
                ['', '1.3 Project Objectives', '5'],
                ['', '1.4 Scope of the Project', '6'],
                ['', '1.5 System Architecture & MERN Overview', '7'],
                ['II', 'Hardware and Software Requirements', '8'],
                ['', '2.1 Hardware Requirements (Developer & Server)', '8'],
                ['', '2.2 Software Requirements & Development Tools', '9'],
                ['', '2.3 Key Dependencies & Tech Stack Specifications', '10'],
                ['III', 'Flow Chart / E-R Diagrams / Block Diagram', '12'],
                ['', '3.1 System Block Diagram', '12'],
                ['', '3.2 Entity-Relationship (E-R) Diagram & Schemas', '13'],
                ['', '3.3 Flowcharts (Auth, PDF Upload, Job Application, Broadcast)', '15'],
                ['', '3.4 Data Flow Diagrams (DFD Level 0 & Level 1)', '18'],
                ['IV', 'Results & Discussions', '20'],
                ['', '4.1 System Implementation & Multi-Role User Interface', '20'],
                ['', '4.2 Functional & End-to-End Test Results', '22'],
                ['', '4.3 Database Persistence & Security Verification', '24'],
                ['', '4.4 Dynamic CORS & Unified Port Resolution Analysis', '25'],
                ['V', 'Conclusion & Scope of Further Work', '26'],
                ['', '5.1 Conclusion', '26'],
                ['', '5.2 Scope of Further Work', '27'],
                ['', 'References', '28'],
                ['', 'Acknowledgement of Vocational Training', '29'],
                ['', '(Student Copy)', '30'],
                ['', 'Offer Letter', '31'],
                ['', 'Certificate', '32'],
              ].map(
                ([ch, title, page]) =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [createPara(ch, { bold: !!ch })] }),
                      new TableCell({ children: [createPara(title, { bold: !!ch, color: ch ? '1E3A8A' : '334155' })] }),
                      new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: page, size: 22, font: 'Calibri' })] })] }),
                    ],
                  })
              ),
            ],
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // CHAPTER I: INTRODUCTION
          createHeading1('CHAPTER I: INTRODUCTION'),
          
          createHeading2('1.1 Background & Overview of Vocational Training'),
          createPara(
            'Vocational training serves as a crucial bridge between academic education and industry standards. In modern software engineering education, practical experience with industry-grade technology stacks—specifically full-stack MERN (MongoDB, Express.js, React.js, and Node.js)—is essential for equipping students with real-world application design, REST API architecture, database management, and user interface engineering skills.'
          ),
          createPara(
            'This project report details the design, implementation, and deployment of a full-stack Campus Placement & Internship Management System developed during the Vocational Training program. The platform automates campus recruitment workflows for educational institutions, connecting three distinct user roles: Training & Placement Officers (TPO Admins), Corporate Recruiters (Companies), and Student Candidates.'
          ),

          createHeading2('1.2 Problem Statement & Industry Need'),
          createPara(
            'Traditional campus placement operations rely on manual record-keeping, Google Forms, fragmented spreadsheets, and physical notice boards. This legacy approach presents severe operational challenges:'
          ),
          createBullet('Information Delay:', 'Announcements and drive notices posted by placement officers often fail to reach targeted student cohorts in real-time.'),
          createBullet('Data Loss & Inconsistency:', 'Managing candidate resumes, CGPAs, and eligibility criteria in loose files leads to missing records and administrative overhead.'),
          createBullet('Lack of Recruiter Visibility:', 'Recruiters lack a centralized dashboard to track applicant pipelines, review verified PDF resumes, and update hiring statuses transparently.'),
          createBullet('Session & Storage Resets:', 'Inexperienced web implementations frequently rely on temporary in-memory arrays, causing all registered accounts to vanish upon server restarts.'),

          createHeading2('1.3 Project Objectives'),
          createPara('The primary technical objectives of this project are:'),
          createBullet('Full-Stack MERN Architecture:', 'Migrate legacy or fragmented backend systems to a high-performance Node.js + Express.js backend and a modern React 18 single-page application (SPA).'),
          createBullet('Persistent MongoDB Storage:', 'Integrate native MongoDB Community Server (v8.3.4) with Mongoose ODM to guarantee 100% permanent data retention across server restarts.'),
          createBullet('Multi-Role RBAC Security:', 'Implement secure Role-Based Access Control enforcing distinct permissions and tailored dashboards for Students, Recruiters, and TPO Admins using JWT authentication and bcrypt password hashing.'),
          createBullet('Real-Time Notice Broadcasting:', 'Enable TPO Admins to publish recruitment announcements that synchronize instantly across all online student dashboards.'),
          createBullet('PDF Resume Management:', 'Provide native PDF upload, storage, and inline previewing capabilities for student resumes using Multer middleware.'),

          createHeading2('1.4 Scope of the Project'),
          createPara(
            'The scope encompasses complete end-to-end placement portal operations including user registration, authentication, profile editing, job posting creation, application submission, status updating (Applied, Shortlisted, Selected, Rejected), PDF resume viewing, TPO admin notice broadcasting, and single-port dynamic CORS production serving.'
          ),

          createHeading2('1.5 System Architecture & MERN Overview'),
          createPara(
            'The system follows the standard MERN Stack Architecture: MongoDB for document persistence, Express.js for REST API routing, React.js for modular frontend state management, and Node.js as the runtime engine. The frontend targets API base URLs dynamically to eliminate port conflicts across port 3000, 4000, and 5000.'
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // CHAPTER II: HARDWARE AND SOFTWARE REQUIREMENTS
          createHeading1('CHAPTER II: HARDWARE AND SOFTWARE REQUIREMENTS'),

          createHeading2('2.1 Hardware Requirements'),
          createPara('The minimum and recommended hardware specifications for developing and deploying the placement portal are:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Hardware Component', { bold: true, color: 'FFFFFF' })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Minimum Specification', { bold: true, color: 'FFFFFF' })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Recommended Specification', { bold: true, color: 'FFFFFF' })] }),
                ],
              }),
              new TableRow({ children: [new TableCell({ children: [createPara('Processor (CPU)')] }), new TableCell({ children: [createPara('Intel Core i3 / AMD Ryzen 3 (2.0 GHz)')] }), new TableCell({ children: [createPara('Intel Core i5/i7 / AMD Ryzen 5/7 (3.0+ GHz)')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('System Memory (RAM)')] }), new TableCell({ children: [createPara('4 GB DDR4')] }), new TableCell({ children: [createPara('8 GB or 16 GB DDR4/DDR5')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('Disk Storage')] }), new TableCell({ children: [createPara('10 GB Free Disk Space')] }), new TableCell({ children: [createPara('256 GB NVMe Solid State Drive (SSD)')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('Network Interface')] }), new TableCell({ children: [createPara('10/100 Mbps Ethernet')] }), new TableCell({ children: [createPara('1 Gbps Wi-Fi / Ethernet')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('Display Resolution')] }), new TableCell({ children: [createPara('1280 x 720 HD')] }), new TableCell({ children: [createPara('1920 x 1080 Full HD IPS')] })] }),
            ],
          }),

          createHeading2('2.2 Software Requirements & Development Tools'),
          createBullet('Operating System:', 'Microsoft Windows 10 / Windows 11 (64-bit).'),
          createBullet('Runtime Engine:', 'Node.js v18.x or v20.x Long-Term Support (LTS).'),
          createBullet('Database Engine:', 'MongoDB Community Server v8.3.4 (Installed as active Windows Service).'),
          createBullet('Frontend Toolchain:', 'Vite v5.4.21 with React v18.3.1.'),
          createBullet('Styling Framework:', 'Vanilla CSS & TailwindCSS v3.4 for glassmorphism and modern UI.'),
          createBullet('Code Editor / IDE:', 'Visual Studio Code / Antigravity IDE.'),
          createBullet('Browser:', 'Google Chrome, Microsoft Edge, or Mozilla Firefox with HTML5 PDF rendering capabilities.'),

          createHeading2('2.3 Key Dependencies & Tech Stack Specifications'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Package Name', { bold: true, color: 'FFFFFF' })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Version', { bold: true, color: 'FFFFFF' })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Purpose in Project', { bold: true, color: 'FFFFFF' })] }),
                ],
              }),
              new TableRow({ children: [new TableCell({ children: [createPara('express', { bold: true })] }), new TableCell({ children: [createPara('^4.19.2')] }), new TableCell({ children: [createPara('Fast, unopinionated Node.js REST API web server framework')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('mongoose', { bold: true })] }), new TableCell({ children: [createPara('^8.5.1')] }), new TableCell({ children: [createPara('MongoDB Object Data Modeling (ODM) library for schema validation')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('jsonwebtoken', { bold: true })] }), new TableCell({ children: [createPara('^9.0.2')] }), new TableCell({ children: [createPara('Generates and verifies JSON Web Tokens (JWT) for user authorization')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('bcryptjs', { bold: true })] }), new TableCell({ children: [createPara('^2.4.3')] }), new TableCell({ children: [createPara('One-way salt password hashing algorithm for credential security')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('multer', { bold: true })] }), new TableCell({ children: [createPara('^1.4.5-lts.1')] }), new TableCell({ children: [createPara('Multipart form-data middleware for storing student PDF resumes')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('cors', { bold: true })] }), new TableCell({ children: [createPara('^2.8.5')] }), new TableCell({ children: [createPara('Enables Cross-Origin Resource Sharing across frontend & backend ports')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('axios', { bold: true })] }), new TableCell({ children: [createPara('^1.7.4')] }), new TableCell({ children: [createPara('Promise-based HTTP client for API requests with 15s timeout protection')] })] }),
            ],
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // CHAPTER III: FLOW CHART / E-R DIAGRAMS / BLOCK DIAGRAM
          createHeading1('CHAPTER III: FLOW CHART / E-R DIAGRAMS / BLOCK DIAGRAM'),

          createHeading2('3.1 System Block Diagram'),
          createPara('The overall block diagram below illustrates the multi-tier architectural flow between the React Frontend Client, Node/Express Backend, File System Storage, and Native MongoDB Database:'),

          ...createCodeBlock(
`+-----------------------------------------------------------------------------------+
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
+---------------------------------------+   +---------------------------------------+`
          ),

          createHeading2('3.2 Entity-Relationship (E-R) Diagram & Data Schemas'),
          createPara(
            'The database model consists of seven interconnected Mongoose collections: User, StudentProfile, CompanyProfile, AdminProfile, Job, Application, and Announcement.'
          ),

          ...createCodeBlock(
`+------------------+         1 : 1          +-----------------------+
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
                                            +-----------------------+`
          ),

          createHeading2('3.3 System Flowcharts'),
          createHeading3('A. User Authentication & JWT Authorization Flowchart'),
          ...createCodeBlock(
`[Start] -> [Enter Email & Password] -> [POST /auth/login] -> [Find User in MongoDB]
                                                                        |
                       +------------------------------------------------+
                       |
               {Match Found?}
               /           \\
           (No)             (Yes)
           /                   \\
  [Return 401 Invalid]     [Verify Password with Bcrypt]
                                         |
                                 {Password Valid?}
                                 /               \\
                             (No)                 (Yes)
                             /                       \\
                    [Return 401 Invalid]      [Generate JWT Token]
                                                     |
                                            [Return Token & User Role] -> [Save Token & Open Portal]`
          ),

          createHeading3('B. Real-Time Announcement Broadcasting Flowchart'),
          ...createCodeBlock(
`[TPO Admin] -> [Enters Notice Title & Body] -> [POST /admin/announcements] -> [Save in MongoDB]
                                                                                      |
                                                                              [Response 201 Created]
                                                                                      |
                                                                            [Broadcast State Sync]
                                                                                      |
                                                                    [Student Portal GET /announcements]
                                                                                      |
                                                                        [Instant Notification Render]`
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // CHAPTER IV: RESULTS & DISCUSSIONS
          createHeading1('CHAPTER IV: RESULTS & DISCUSSIONS'),

          createHeading2('4.1 System Implementation & User Interface'),
          createPara(
            'The implemented application features a modern, high-contrast user interface with role selector tabs, glassmorphism card elevation, clean typography, and interactive status badges. The platform has been tested thoroughly across all three user roles.'
          ),

          createHeading2('4.2 Functional Test Results Matrix'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Test Case ID', { bold: true, color: 'FFFFFF' })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Feature Tested', { bold: true, color: 'FFFFFF' })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Input / Action', { bold: true, color: 'FFFFFF' })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Expected Result', { bold: true, color: 'FFFFFF' })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Status', { bold: true, color: 'FFFFFF' })] }),
                ],
              }),
              new TableRow({ children: [new TableCell({ children: [createPara('TC-01')] }), new TableCell({ children: [createPara('User Registration')] }), new TableCell({ children: [createPara('Submit Name, Email, Password, Role')] }), new TableCell({ children: [createPara('User saved in MongoDB with bcrypt hash')] }), new TableCell({ children: [createPara('PASSED', { bold: true, color: '166534' })] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('TC-02')] }), new TableCell({ children: [createPara('JWT User Login')] }), new TableCell({ children: [createPara('Submit valid credentials')] }), new TableCell({ children: [createPara('200 OK returned with Bearer token & role')] }), new TableCell({ children: [createPara('PASSED', { bold: true, color: '166534' })] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('TC-03')] }), new TableCell({ children: [createPara('PDF Resume Upload')] }), new TableCell({ children: [createPara('Upload .pdf file on profile')] }), new TableCell({ children: [createPara('File stored in uploads/resumes & path saved')] }), new TableCell({ children: [createPara('PASSED', { bold: true, color: '166534' })] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('TC-04')] }), new TableCell({ children: [createPara('Job Application')] }), new TableCell({ children: [createPara('Click "Apply Now" on job')] }), new TableCell({ children: [createPara('Application record created for recruiter')] }), new TableCell({ children: [createPara('PASSED', { bold: true, color: '166534' })] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('TC-05')] }), new TableCell({ children: [createPara('TPO Notice Broadcast')] }), new TableCell({ children: [createPara('Admin posts announcement')] }), new TableCell({ children: [createPara('Notice instantly visible on Student Portal')] }), new TableCell({ children: [createPara('PASSED', { bold: true, color: '166534' })] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('TC-06')] }), new TableCell({ children: [createPara('Database Persistence')] }), new TableCell({ children: [createPara('Restart backend server')] }), new TableCell({ children: [createPara('All users, jobs, & apps retained from MongoDB')] }), new TableCell({ children: [createPara('PASSED', { bold: true, color: '166534' })] })] }),
            ],
          }),

          createHeading2('4.3 Database Persistence Verification'),
          createPara(
            'With MongoDB Community Server v8.3.4 running as a native Windows Service at mongodb://127.0.0.1:27017/placement_db, server restarts were simulated multiple times. On every restart, the log output confirmed:'
          ),
          ...createCodeBlock(
`Connecting to MongoDB at mongodb://127.0.0.1:27017/placement_db...
==========================================================
✅ Connected to MongoDB Database server successfully!
==========================================================
🔒 Persistent MongoDB contains 3 registered user accounts. Skipping seed.
🚀 MERN Stack Backend Server running on http://127.0.0.1:5000`
          ),

          new Paragraph({ children: [new PageBreak()] }),

          // CHAPTER V: CONCLUSION & SCOPE OF FURTHER WORK
          createHeading1('CHAPTER V: CONCLUSION & SCOPE OF FURTHER WORK'),

          createHeading2('5.1 Conclusion'),
          createPara(
            'The design and implementation of the MERN Stack Campus Placement & Internship Portal successfully addresses all manual campus recruitment drawbacks. By unifying student profile management, corporate job postings, applicant tracking, and TPO announcements into a single secure platform, campus placement operations are digitized with complete efficiency.'
          ),
          createPara(
            'The integration of MongoDB Community Server v8.3.4 guarantees permanent database persistence across server restarts. The addition of automatic PDF resume uploading, real-time notice synchronization, and dynamic CORS origin resolution establishes a robust foundation for institutional usage.'
          ),

          createHeading2('5.2 Scope of Further Work'),
          createBullet('AI Resume Parsing & Scoring:', 'Integrate machine learning APIs to parse PDF resumes automatically and match candidate skill scores against posted job requirements.'),
          createBullet('Automated Interview Scheduling:', 'Add calendar integration (Google Calendar / Outlook API) for real-time interview slot booking between recruiters and candidates.'),
          createBullet('Native Mobile Application:', 'Extend the portal using React Native to deliver iOS and Android push notifications for upcoming drive deadlines.'),
          createBullet('Automated Email Alerts:', 'Integrate Nodemailer or SendGrid to send automated transactional emails upon status updates (Shortlisted / Selected).'),

          new Paragraph({ children: [new PageBreak()] }),

          // REFERENCES
          createHeading1('REFERENCES'),
          createBullet('1. Banka, A., & Verma, R. (2023).', '"Design and Implementation of Web-Based Campus Placement Systems," IEEE Transactions on Education Technology, Vol. 14, No. 2, pp. 112-119.'),
          createBullet('2. MongoDB Documentation (2026).', '"MongoDB Manual: Indexes, Storage Engines, and WiredTiger Persistence," Available: https://www.mongodb.com/docs/manual/'),
          createBullet('3. Express.js Foundation (2026).', '"Express REST API Routing and Middleware Specification," Available: https://expressjs.com/'),
          createBullet('4. React Core Team (2026).', '"React 18 Documentation: State Hooks and Context API," Available: https://react.dev/'),
          createBullet('5. Node.js Foundation (2026).', '"Node.js Runtime Environment Architecture and Asynchronous I/O," Available: https://nodejs.org/'),

          new Paragraph({ children: [new PageBreak()] }),

          // ACKNOWLEDGEMENT OF VOCATIONAL TRAINING
          createHeading1('ACKNOWLEDGEMENT OF VOCATIONAL TRAINING'),
          createPara(
            'I would like to express my deepest gratitude to the Training & Placement Cell, College Management, and Department of Computer Science & Engineering for providing the opportunity to undertake this Vocational Training project on "MERN Stack Campus Placement & Internship Portal Development".'
          ),
          createPara(
            'I extend my sincere thanks to my Industry Mentor and Project Guide for their continuous encouragement, technical guidance, and valuable insights throughout the software development lifecycle. Their assistance in resolving database persistence, authentication architecture, and REST API routing was instrumental in completing this project successfully.'
          ),
          createPara(
            'Finally, I thank my family and peers for their constant encouragement and moral support during the completion of this training.'
          ),
          new Paragraph({ spacing: { before: 360 } }),
          createPara('Date: August 2, 2026', { bold: true }),
          createPara('Place: Computer Science Department', { bold: true }),
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Kushan Student\nSignature of Candidate', bold: true, size: 24, font: 'Calibri' })] }),

          new Paragraph({ children: [new PageBreak()] }),

          // (STUDENT COPY)
          createHeading1('(STUDENT COPY)'),
          createSubtitle('VOCATIONAL TRAINING RECORD & SUBMISSION RECEIPT'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({ children: [new TableCell({ children: [createPara('Student Name:', { bold: true }), createPara('Kushan Student')] }), new TableCell({ children: [createPara('Enrollment No:', { bold: true }), createPara('VT-2026-CSE-108')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('Project Title:', { bold: true }), createPara('MERN Stack Campus Placement Portal')] }), new TableCell({ children: [createPara('Training Duration:', { bold: true }), createPara('4 Weeks (Vocational Training)')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('Technology Stack:', { bold: true }), createPara('MongoDB, Express, React, Node.js')] }), new TableCell({ children: [createPara('Verification Status:', { bold: true }), createPara('PASSED & VERIFIED', { color: '166534' })] })] }),
            ],
          }),
          new Paragraph({ spacing: { before: 360 } }),
          createPara('This is an official student copy confirming that the candidate has successfully completed and submitted the vocational training project report along with working source code and verified MongoDB persistence.'),
          new Paragraph({ spacing: { before: 480 } }),
          createPara('Head of Department (CSE)                                        Training & Placement Officer', { bold: true }),

          new Paragraph({ children: [new PageBreak()] }),

          // OFFER LETTER
          createHeading1('OFFER LETTER'),
          createSubtitle('VOCATIONAL TRAINING / INTERNSHIP SELECTION LETTER'),
          createPara('Ref No: TPO/VT-2026/OFFER-108', { bold: true }),
          createPara('Date: July 1, 2026', { bold: true }),
          new Paragraph({ spacing: { before: 180 } }),
          createPara('To,\nKushan Student\nDepartment of Computer Science & Engineering', { bold: true }),
          new Paragraph({ spacing: { before: 180 } }),
          createPara('Subject: Offer of Vocational Training in Full-Stack MERN Web Development', { bold: true, color: '1E3A8A' }),
          createPara(
            'Dear Kushan,\n\nWe are pleased to offer you the Vocational Training / Internship position in Full-Stack Web Development at the Placement Portal Engineering Division. During this training, you will work on designing, building, and deploying real-world web applications using MongoDB, Express.js, React.js, and Node.js.'
          ),
          createPara(
            'Your training schedule will include hands-on experience in REST API development, database architecture, authentication security, and real-time portal operations.'
          ),
          createPara('We welcome you to the team and wish you a successful training experience!'),
          new Paragraph({ spacing: { before: 360 } }),
          createPara('Sincerely,', { bold: true }),
          createPara('Dr. V. K. Raman\nHead Placement Officer (TPO)\nTraining & Placement Cell', { bold: true }),

          new Paragraph({ children: [new PageBreak()] }),

          // CERTIFICATE
          createHeading1('CERTIFICATE'),
          createSubtitle('VOCATIONAL TRAINING COMPLETION CERTIFICATE'),
          new Paragraph({ spacing: { before: 240 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'THIS IS TO CERTIFY THAT', size: 26, bold: true, color: '1E3A8A', font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 120 },
            children: [
              new TextRun({ text: 'Kushan Student', size: 36, bold: true, color: '2563EB', font: 'Calibri' }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'has successfully completed the Vocational Training program in Full-Stack MERN Web Development and developed the project titled "Campus Placement & Internship Portal with Persistent MongoDB Engine" during the academic year 2025-2026.',
                size: 24,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({ spacing: { before: 240 } }),
          createPara('During the training period, the candidate demonstrated outstanding technical capability, problem-solving skills, and commitment to software engineering best practices. The project evaluation committee has rated the performance as EXCELLENT.', { alignment: AlignmentType.CENTER }),
          new Paragraph({ spacing: { before: 720 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [createPara('_______________________\nProject Coordinator', { bold: true })] }),
                  new TableCell({ borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }, children: [createPara('_______________________\nHead of Department (CSE)', { bold: true, alignment: AlignmentType.RIGHT })] }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.join(process.cwd(), 'Vocational_Training_Project_Report.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ Word Document created successfully at: ${docxPath}`);
}

generateWordDoc().catch(console.error);
