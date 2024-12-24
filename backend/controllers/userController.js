import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

// Helper function to generate JWT token
const generateToken = (userId) => {
  const secretKey = process.env.JWT_SECRET || 'defaultSecret'; // Use an environment variable for security
  const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '24h' });
  return token;
};


export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password
    });
    
    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
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

    // Log request payload
    console.log('Login request received:', req.body);

    // Find user and explicitly include password in the query
    const user = await User.findOne({ email }).select('+password');

    // Log user details fetched from the database
    console.log('User fetched from database:', user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    console.log('Checking password match...');
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
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
    // Generate token for the authenticated user
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