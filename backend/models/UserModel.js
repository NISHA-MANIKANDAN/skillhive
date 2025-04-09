import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minLength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: false // Password is not required for Google users
  },
  oauthProvider: {
    type: String,
    enum: [null, 'google'],
    default: null
  },
  oauthId: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  location: {
    type: String,
    default: null
  },
  company: {
    type: String,
    default: null
  },
  about: {
    type: String,
    default: null
  },
  skills: {
    type: [String],
    default: []
  },

  // 🔽 New ML-Driven Fields 🔽
  learnerType: {
    type: String,
    enum: ['student', 'professional', 'industrialist'],
    default: null
  },
  interests: {
    type: [String], // e.g. ['AI', 'Web Development']
    default: []
  },
  seeking: {
    type: String,
    enum: ['job', 'internship', 'higher-studies', 'upskilling', null],
    default: null
  }

}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.oauthProvider === 'google') {
    return next(); // Skip password hashing for Google OAuth users
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

export default mongoose.model('User', UserSchema);
