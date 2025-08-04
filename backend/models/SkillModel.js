import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  objective: { type: String, required: true },
  description: { type: String, required: true },
});

const CertificateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: Date, required: true },
  fileUrl: { type: String, required: true }  // Store the URL to the uploaded file
});

const SkillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skillName: { type: String, required: true },
  staffName: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // Added verification field
  location: {
    isOnline: { type: Boolean, default: false },
    street: { type: String },
    suite: { type: String },
    city: { type: String },
    province: { type: String },
    country: { type: String },
    postalCode: { type: String },
  },
  availability: [
    {
      fromDay: { type: String },
      toDay: { type: String },
      fromTime: { type: String },
      toTime: { type: String },
    },
  ],
  fees: {
    classLength: { type: String },
    price: { type: Number },
  },
  curriculum: {
    lessons: [LessonSchema],
  },
  certificates: [CertificateSchema] // Add certificates array to schema
}, { timestamps: true }); // Adding timestamps to track creation and update dates

export default mongoose.model('Skill', SkillSchema);