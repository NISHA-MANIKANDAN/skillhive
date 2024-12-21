// passportConfig.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/UserModel.js';

const initializePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:4000',
        passReqToCallback: true,
        proxy: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          // Log the profile data for debugging
          console.log('Google Profile:', JSON.stringify(profile, null, 2));
          
          const existingUser = await User.findOne({
            $or: [
              { email: profile.emails[0].value },
              { oauthId: profile.id }
            ]
          });

          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = await User.create({
            username: profile.displayName || profile.emails[0].value.split('@')[0],
            email: profile.emails[0].value,
            oauthProvider: 'google',
            oauthId: profile.id
          });

          return done(null, newUser);
        } catch (error) {
          console.error('Google Strategy Error:', error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default initializePassport;