import express from 'express';
import passport from 'passport';
import { signup, login, googleCallback } from '../controllers/userController.js';
import authenticateJWT from '../middleware/authUser.js';

const userRouter = express.Router();

// Signup Route
userRouter.post('/signup', signup);

// Login Route (Password-based)
userRouter.post('/login', login);

// OAuth Routes (e.g., Google)
userRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
userRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleCallback);

// Protected route (example)
userRouter.get('/profile', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected profile page', user: req.user });
});

export default userRouter;