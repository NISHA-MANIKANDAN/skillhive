import User from '../models/UserModel.js';
import { spawn } from 'child_process';

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('skills');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userSkills = user.skills; // This is an array of skills like ["React", "MongoDB"]
console.log(user.skills);
    const pythonProcess = spawn('python', [
      'D:/skillhive/backend/ml/run_recommender.py',
      userSkills.join(','), // Fixed: pass userSkills instead of undefined inputSkills
      'D:/skillhive/backend/ml/job_skills.csv'
    ]);

    let output = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (error) => {
      console.error('Python error:', error.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const recommendations = JSON.parse(output);
          res.json({
            userSkills,
            recommendedLessons: recommendations.recommended
          });
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          res.status(500).json({ message: 'Failed to parse recommendations' });
        }
      } else {
        res.status(500).json({ message: 'Python script failed' });
      }
    });
  } catch (error) {
    console.error('Error in recommendation:', error);
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
};
