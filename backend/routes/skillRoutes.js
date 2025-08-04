import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
  addTimeSlot,
  addLesson,
  deleteLesson,
  addCertificate,
  deleteCertificate,
  getAllSkills,
  verifySkill,
  getPendingSkills,
 getLoggedInUserSkills
} from '../controllers/skillController.js';
import authenticateJWT from '../middleware/authUser.js';
import { getRecommendations } from '../controllers/mlController.js';
import Skill from '../models/SkillModel.js';


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/certificates/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Unsupported file format'), false);
};

const upload = multer({ storage, fileFilter });

const skillRouter = express.Router();

skillRouter.get('/all', getAllSkills);
skillRouter.post('/', authenticateJWT, upload.array('certificateFiles'), createSkill);
skillRouter.get('/', authenticateJWT, getSkills);
skillRouter.put('/:id', authenticateJWT, upload.array('certificateFiles'), updateSkill);
skillRouter.delete('/:id', authenticateJWT, deleteSkill);

skillRouter.post('/:id/timeslot', authenticateJWT, addTimeSlot);
skillRouter.post('/:id/lesson', authenticateJWT, addLesson);
skillRouter.delete('/:id/lesson/:lessonId', authenticateJWT, deleteLesson);

skillRouter.post('/:id/certificate',
  authenticateJWT,
  upload.single('certificateFile'),
  (req, res, next) => {
    if (req.file) {
      req.body.certificate = {
        name: req.body.name,
        issuer: req.body.issuer,
        date: req.body.date,
        fileUrl: `/uploads/certificates/${req.file.filename}`,
      };
    }
    next();
  },
  addCertificate
);

skillRouter.delete('/:id/certificate/:certificateId', authenticateJWT, deleteCertificate);
skillRouter.post('/recommend', authenticateJWT, getRecommendations);
skillRouter.get('/pending', authenticateJWT, getPendingSkills);
skillRouter.patch('/:id/verify', authenticateJWT, verifySkill);
skillRouter.get('/my-skills', authenticateJWT, getLoggedInUserSkills);
skillRouter.put('/:id/verify', async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { isVerified: req.body.isVerified },
      { new: true }
    );
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

export default skillRouter;
