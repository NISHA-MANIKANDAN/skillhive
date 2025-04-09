import express from 'express';
import {
  createSkill,
  getSkills,
  updateSkill,
  deleteSkill,
  addTimeSlot,
  addLesson,
  deleteLesson,
  getAllSkills
} from '../controllers/skillController.js';
import authenticateJWT from '../middleware/authUser.js';

const skillRouter = express.Router();
skillRouter.get('/all', getAllSkills);

// Create a new skill
skillRouter.post('/', authenticateJWT, createSkill);

// Get all skills for the authenticated user
skillRouter.get('/', authenticateJWT, getSkills);

// Update a skill by ID
skillRouter.put('/:id', authenticateJWT, updateSkill);

// Delete a skill by ID
skillRouter.delete('/:id', authenticateJWT, deleteSkill);

// Add a new time slot to a skill
skillRouter.post('/:id/timeslot', authenticateJWT, addTimeSlot);

// Add a new lesson to the curriculum of a skill
skillRouter.post('/:id/lesson', authenticateJWT, addLesson);

// Delete a lesson from the curriculum of a skill
skillRouter.delete('/:id/lesson/:lessonId', authenticateJWT, deleteLesson);

export default skillRouter;
