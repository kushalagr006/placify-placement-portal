import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads/resumes directory exists
const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Disk Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const origName = file.originalname || 'resume.pdf';
    const ext = path.extname(origName).toLowerCase() || '.pdf';
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

// File filter: accept PDF files
const fileFilter = (req, file, cb) => {
  const isPdf =
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'application/x-pdf' ||
    file.mimetype === 'application/octet-stream' ||
    (file.originalname && file.originalname.toLowerCase().endsWith('.pdf'));

  if (isPdf) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf document files are allowed'), false);
  }
};

export const uploadResumeMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
});
