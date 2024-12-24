import mongoose from 'mongoose';
const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  objective: { type: String, required: true },
  description: { type: String, required: true },
});

const SkillSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
});


export default mongoose.model('Skill', SkillSchema);