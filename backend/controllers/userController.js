import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import { google } from 'googleapis';

// Helper function to generate JWT token
export const generateToken = (userId) => {
  const secretKey = process.env.JWT_SECRET || 'defaultSecret';
  const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '24h' });
  return token;
};

export const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      googleToken,
      learnerType,
      interests,
      seeking
    } = req.body;

    if (googleToken) {
      const client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      let existingUser = await User.findOne({ email: payload.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      const user = new User({
        username: payload.name || username,
        email: payload.email,
        googleId: payload.sub,
        avatar: payload.picture,
        learnerType,
        interests,
        seeking,
      });

      await user.save();

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.username,
          email: user.email
        }
      });
    } else {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      const user = new User({
        username,
        email,
        password,
        learnerType,
        interests,
        seeking,
      });

      await user.save();

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.username,
          email: user.email
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login request received:', req.body);
    const user = await User.findOne({ email }).select('+password');

    console.log('User fetched from database:', user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log('Checking password match...');
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error in login function:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const googleCallback = async (req, res) => {
  try {
    const token = generateToken(req.user);

    res.send(`
      <script>
        if (window.opener) {
          window.opener.postMessage(${JSON.stringify({
            token,
            user: {
              id: req.user._id,
              name: req.user.name,
              email: req.user.email
            }
          })}, "${process.env.FRONTEND_URL}");
          window.close();
        } else {
          window.location.href = "${process.env.FRONTEND_URL}";
        }
      </script>
    `);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(req.user.id);

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, location, company, about, skills, avatar, learnerType, interests, seeking, bookedSkill } = req.body;

    if (
      !name && !location && !company && !about &&
      !skills && !avatar && !learnerType && !interests && !seeking && !bookedSkill
    ) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update. Provide at least one field.',
      });
    }

    // First, retrieve the current user
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Update the profile with the existing and new data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          name: name || currentUser.name,
          location: location || currentUser.location,
          company: company || currentUser.company,
          about: about || currentUser.about,
          avatar: avatar || currentUser.avatar,
          learnerType: learnerType || currentUser.learnerType,
          interests: interests || currentUser.interests,
          seeking: seeking || currentUser.seeking,
        },
        // If bookedSkill is provided, add it to the skills array
        $addToSet: {
          skills: bookedSkill || [],
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
