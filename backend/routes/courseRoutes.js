// routes/courseRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import authenticateJWT from '../middleware/authUser.js';
import {
  getModulesBySkill,
  createModule,
  uploadFiles,
  deleteModule,
  updateModule,
  deleteFile
} from '../controllers/courseController.js';
import fs from 'fs';

// Set up multer storage for course content
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/course-content/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExt}`;
    cb(null, fileName);
  }
});

// File filter to only allow certain types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Documents
    'application/pdf', 
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Videos
    'video/mp4', 
    'video/mpeg', 
    'video/quicktime',
    // Images
    'image/jpeg', 
    'image/png', 
    'image/gif',
    // Audio
    'audio/mpeg',
    'audio/wav',
    // Archives
    'application/zip',
    'application/x-rar-compressed'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Please upload a valid document, video, image, or archive file.'), false);
  }
};

// Configure multer with limits
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max file size
});

const courseRouter = express.Router();

// Course module routes
courseRouter.get('/skill/:skillId/content', authenticateJWT, getModulesBySkill);
courseRouter.post('/modules', authenticateJWT, createModule);
courseRouter.post('/upload', authenticateJWT, upload.array('files', 10), uploadFiles);
courseRouter.delete('/modules/:moduleId', authenticateJWT, deleteModule);
courseRouter.put('/modules/:moduleId', authenticateJWT, updateModule);
courseRouter.delete('/modules/:moduleId/files/:fileId', authenticateJWT, deleteFile);

export default courseRouter;    