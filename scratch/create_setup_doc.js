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
  ShadingType,
  PageBreak,
} from 'docx';

const createTitle = (text) =>
  new Paragraph({
    text: text,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 44, // 22pt
        color: '1E3A8A', // Dark Blue
        font: 'Calibri',
      }),
    ],
  });

const createSubtitle = (text) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 240 },
    children: [
      new TextRun({
        text,
        size: 26, // 13pt
        italic: true,
        color: '4B5563',
        font: 'Calibri',
      }),
    ],
  });

const createHeading1 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32, // 16pt
        color: '1E3A8A',
        font: 'Calibri',
      }),
    ],
  });

const createHeading2 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26, // 13pt
        color: '2563EB',
        font: 'Calibri',
      }),
    ],
  });

const createPara = (text, options = {}) =>
  new Paragraph({
    spacing: { before: 60, after: 100, line: 276 },
    alignment: options.alignment || AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        size: 22, // 11pt
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
    spacing: { before: 40, after: 60, line: 276 },
    children: [
      new TextRun({
        text: boldPrefix + ' ',
        bold: true,
        size: 22,
        font: 'Calibri',
        color: '1E293B',
      }),
      new TextRun({
        text,
        size: 22,
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
            size: 20,
            color: '0F172A',
          }),
        ],
      })
  );
};

async function generateSetupDoc() {
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
                    text: 'New Laptop Setup & Installation Manual | Campus Placement Portal',
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
          // TITLE
          createTitle('NEW LAPTOP SETUP & DEPLOYMENT GUIDE'),
          createSubtitle('A COMPLETE, STEP-BY-STEP MANUAL TO INSTALL DEPENDENCIES, CONFIGURE MONGODB, AND RUN THE MERN STACK PLACEMENT PORTAL'),

          createHeading1('1. REQUIRED SOFTWARE INSTALLATIONS'),
          createPara('Before running the project on a new laptop, install these 3 core prerequisite software packages:'),

          createHeading2('A. Node.js (JavaScript Runtime Engine)'),
          createBullet('Purpose:', 'Executes Express backend server routes and compiles React frontend components.'),
          createBullet('Download URL:', 'https://nodejs.org/ (Download Version 18 LTS or 20 LTS)'),
          createBullet('Verification Command:', 'Open terminal and run "node -v" and "npm -v"'),

          createHeading2('B. MongoDB Community Server (Database Engine)'),
          createBullet('Purpose:', 'Provides persistent document database storage for registered users, job drives, and applications.'),
          createBullet('Download URL:', 'https://www.mongodb.com/try/download/community (Select Windows MSI Installer)'),
          createBullet('Critical Option:', 'Keep "Install MongoDB as a Service" checked during setup.'),

          createHeading2('C. Visual Studio Code (Code Editor)'),
          createBullet('Purpose:', 'Recommended IDE for opening project directory and running integrated terminal instances.'),
          createBullet('Download URL:', 'https://code.visualstudio.com/'),

          new Paragraph({ children: [new PageBreak()] }),

          createHeading1('2. PROJECT DIRECTORY & FILE STRUCTURE'),
          createPara('Ensure the project folder contains the following core files and directories:'),

          ...createCodeBlock(
`VT2.0 TEST/
├── backend_node/               # Express Node.js Server & Routes
│   ├── middleware/             # auth.js (JWT) & upload.js (Multer)
│   ├── models/                 # User, StudentProfile, Job, Application Schemas
│   ├── routes/                 # auth.js, student.js, company.js, admin.js
│   └── server.js               # Main Express Server Entry Point (Port 5000)
├── src/                        # React Frontend Source Code
│   ├── api/                    # client.js (Axios Base URL & Timeout)
│   ├── components/             # React UI Components (Student, Recruiter, Admin)
│   ├── context/                # PortalContext.jsx (Global App State & Sync)
│   └── App.jsx                 # Application Router & Page Layouts
├── uploads/                    # Physical Storage Directory for PDF Resumes
│   └── resumes/
├── package.json                # npm Project Manifest & Scripts
├── vite.config.js              # Vite Build Configuration
└── index.html                  # Root HTML Document`
          ),

          createHeading1('3. STEP-BY-STEP DEPLOYMENT INSTRUCTIONS'),
          
          createHeading2('Step 1: Open Terminal in Project Folder'),
          ...createCodeBlock('cd "C:\\path\\to\\your\\VT2.0 TEST"'),

          createHeading2('Step 2: Install All Project Dependencies'),
          createPara('Run npm install once to fetch all required libraries (Express, React, Mongoose, Axios, Multer, bcryptjs, JWT):'),
          ...createCodeBlock('cmd /c npm install'),

          createHeading2('Step 3: Launch Backend Server (Terminal 1)'),
          ...createCodeBlock('npm run backend'),
          createPara('Expected Output:'),
          ...createCodeBlock(
`Connecting to MongoDB at mongodb://127.0.0.1:27017/placement_db...
==========================================================
✅ Connected to MongoDB Database server successfully!
==========================================================
🚀 MERN Stack Backend Server running on http://127.0.0.1:5000`
          ),

          createHeading2('Step 4: Launch Frontend Application (Terminal 2)'),
          ...createCodeBlock('npm run dev'),
          createPara('Expected Output:'),
          ...createCodeBlock(
`  VITE v5.4.21  ready in 450 ms
  ➜  Local:   http://localhost:3000/`
          ),

          new Paragraph({ children: [new PageBreak()] }),

          createHeading1('4. DEFAULT PRE-SEEDED TEST ACCOUNTS'),
          createPara('The backend automatically pre-populates default demo accounts into MongoDB for instant testing:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Portal Role', { bold: true, color: 'FFFFFF' })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Email Address', { bold: true, color: 'FFFFFF' })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Password', { bold: true, color: 'FFFFFF' })] }),
                  new TableCell({ shading: { fill: '1E3A8A' }, children: [createPara('Access Level', { bold: true, color: 'FFFFFF' })] }),
                ],
              }),
              new TableRow({ children: [new TableCell({ children: [createPara('Student', { bold: true })] }), new TableCell({ children: [createPara('student@vtportal.com')] }), new TableCell({ children: [createPara('student123')] }), new TableCell({ children: [createPara('Apply to jobs, upload PDF resume, view notices')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('Recruiter / Company', { bold: true })] }), new TableCell({ children: [createPara('recruiter@vtportal.com')] }), new TableCell({ children: [createPara('recruiter123')] }), new TableCell({ children: [createPara('Post job drives, view resumes, update applicant status')] })] }),
              new TableRow({ children: [new TableCell({ children: [createPara('TPO Admin', { bold: true })] }), new TableCell({ children: [createPara('admin@vtportal.com')] }), new TableCell({ children: [createPara('admin123')] }), new TableCell({ children: [createPara('Broadcast campus notices, manage students & companies')] })] }),
            ],
          }),

          createHeading1('5. TROUBLESHOOTING COMMON SETUP ISSUES'),
          
          createHeading2('Issue 1: PowerShell Script Execution Error'),
          createPara('If Windows blocks npm scripts, run commands using "cmd /c npm run backend" or execute in Command Prompt.'),

          createHeading2('Issue 2: Port 5000 Already in Use'),
          createPara('If port 5000 is occupied, terminate existing Node processes via Task Manager or run:'),
          ...createCodeBlock('cmd /c taskkill /f /im node.exe'),

          createHeading2('Issue 3: MongoDB Connection Refused'),
          createPara('If MongoDB service is stopped, open Windows Services (services.msc) and ensure "MongoDB Server" status is Running.'),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const docxPath = path.join(process.cwd(), 'New_Laptop_Setup_and_Deployment_Guide.docx');
  fs.writeFileSync(docxPath, buffer);
  console.log(`✅ Setup Document created successfully at: ${docxPath}`);
}

generateSetupDoc().catch(console.error);
