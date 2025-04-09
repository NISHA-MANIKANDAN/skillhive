  import express from 'express';
  import passport from 'passport';
  import { signup, login, googleCallback, getProfile,updateProfile } from '../controllers/userController.js';
  import authenticateJWT from '../middleware/authUser.js';

  const userRouter = express.Router();

  userRouter.post('/signup', signup);
  userRouter.post('/login', login);

  userRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  userRouter.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    googleCallback
  );

  userRouter.get('/profile', authenticateJWT, getProfile);
  userRouter.put('/profile', authenticateJWT, updateProfile);


  export default userRouter;
