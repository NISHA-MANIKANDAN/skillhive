import Skill from '../models/SkillModel.js'
export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find(); // Fetch all skills
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch skills', error: error.message });
  }
};

// Create a new skill
export const createSkill = async (req, res) => {
    try {
      // Ensure that req.user exists and has the userId
      if (!req.user || !req.user.id) {
        return res.status(400).json({ message: 'User not authenticated' });
      }
  
      const userId = req.user.id; // Extract userId from the authenticated user
  
      // Create skill data with the userId
      const skillData = { ...req.body, userId };
      const newSkill = await Skill.create(skillData);
      
      res.status(201).json({message:'created new skill'}); // Return the created skill
    } catch (error) {
      res.status(500).json({ message: 'Failed to create skill', error: error.message });
    }
  };
  
// Get all skills for the authenticated user
export const getSkills = async (req, res) => {
  try {
    const userId = req.user.id;
    const skills = await Skill.find({ userId });
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch skills', error: error.message });
  }
};

// Update a skill by ID
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSkill = await Skill.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.status(200).json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update skill', error: error.message });
  }
};

// Delete a skill by ID
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSkill = await Skill.findByIdAndDelete(id);
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete skill', error: error.message });
  }
};

// Add a new time slot to a skill
export const addTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeSlot } = req.body;
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    skill.availability.push(timeSlot);
    await skill.save();
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add time slot', error: error.message });
  }
};

// Add a new lesson to the curriculum of a skill
export const addLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { lesson } = req.body;
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    skill.curriculum.lessons.push(lesson);
    await skill.save();
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add lesson', error: error.message });
  }
};

// Delete a lesson from the curriculum of a skill
export const deleteLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    skill.curriculum.lessons = skill.curriculum.lessons.filter(
      (lesson) => lesson._id.toString() !== lessonId
    );
    await skill.save();
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete lesson', error: error.message });
  }
};
