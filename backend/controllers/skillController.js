import Skill from '../models/SkillModel.js';

export const getAllSkills = async (req, res) => {
  try {
    const query = req.query.includeUnverified === 'true' ? {} : { isVerified: true };
    const skills = await Skill.find(query);
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch skills', error: error.message });
  }
};

export const createSkill = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User not authenticated' });
      
    }
    if (typeof req.body.availability === 'string') {
      req.body.availability = JSON.parse(req.body.availability);
    }

    const userId = req.user.id;
    const skillData = { ...req.body, userId };

    // 🐞 Debug logs
    console.log("▶️ req.body:", req.body);
    console.log("📎 req.files:", req.files);

    // Handle certificate uploads
   
    const parsedCertificates = JSON.parse(req.body.certificates || '[]');

    skillData.certificates = parsedCertificates.map((cert, index) => ({
      ...cert,
      fileUrl: `/uploads/certificates/${req.files?.[index]?.filename}`,
    }));
    

    const newSkill = await Skill.create(skillData);
    res.status(201).json({
      message: 'Skill created successfully. It will be available after verification.',
      skill: newSkill,
    });
  } catch (error) {
    console.error("❌ Skill creation failed:", error);  // 🔥 Full error log
    res.status(500).json({ message: 'Failed to create skill', error: error.message });
  }
};


export const getSkills = async (req, res) => {
  try {
    const userId = req.user.id;
    const skills = await Skill.find({ userId });
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch skills', error: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (skill.isVerified && !req.body.isVerifiedByAdmin) {
      req.body.isVerified = false;
    }

    delete req.body.isVerifiedByAdmin;

    // If new certificate files are uploaded
    if (req.files && req.files.length > 0) {
      const newCertificates = req.files.map(file => ({
        fileUrl: `/uploads/certificates/${file.filename}`,
      }));
      req.body.certificates = (skill.certificates || []).concat(newCertificates);
    }

    const updatedSkill = await Skill.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedSkill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update skill', error: error.message });
  }
};

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

export const verifySkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Only administrators can verify skills' });
    }

    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    skill.isVerified = isVerified;
    await skill.save();

    const status = isVerified ? 'verified' : 'rejected';
    res.status(200).json({ message: `Skill ${status} successfully`, skill });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update verification status', error: error.message });
  }
};

export const addTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeSlot } = req.body;
    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    skill.isVerified = false;
    skill.availability.push(timeSlot);
    await skill.save();

    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add time slot', error: error.message });
  }
};

export const addLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { lesson } = req.body;
    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    skill.isVerified = false;
    skill.curriculum.lessons.push(lesson);
    await skill.save();

    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add lesson', error: error.message });
  }
};

export const deleteLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    skill.isVerified = false;
    skill.curriculum.lessons = skill.curriculum.lessons.filter(
      lesson => lesson._id.toString() !== lessonId
    );
    await skill.save();

    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete lesson', error: error.message });
  }
};

export const addCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    skill.isVerified = false;
    skill.certificates.push(req.body.certificate);
    await skill.save();

    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add certificate', error: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const { id, certificateId } = req.params;
    const skill = await Skill.findById(id);
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    skill.isVerified = false;
    skill.certificates = skill.certificates.filter(
      cert => cert._id.toString() !== certificateId
    );

    await skill.save();
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete certificate', error: error.message });
  }
};

export const getPendingSkills = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Only administrators can access pending skills' });
    }

    const skills = await Skill.find({ isVerified: false });
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch pending skills', error: error.message });
  }
};
export const getLoggedInUserSkills = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from token by auth middleware
    const skills = await Skill.find({ userId });

    if (!skills.length) {
      return res.status(404).json({ message: 'No skills found for this user' });
    }

    res.status(200).json({
      message: 'Skills retrieved successfully',
      skills,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch user skills',
      error: error.message,
    });
  }
};
