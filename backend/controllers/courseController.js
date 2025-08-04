// controllers/courseController.js
import CourseModule from '../models/CourseModuleModel.js';
import Skill from '../models/SkillModel.js';
import fs from 'fs';
import path from 'path';

// Get all modules for a specific skill
export const getModulesBySkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    
    // Verify skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    // Find all modules for this skill
    const modules = await CourseModule.find({ skillId })
      .sort({ order: 1, createdAt: 1 });
    
    res.status(200).json({ 
      message: 'Modules retrieved successfully',
      modules 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to fetch modules', 
      error: error.message 
    });
  }
};

// Create a new module
export const createModule = async (req, res) => {
  try {
    const { name, description, type, skillId } = req.body;
    
    // Check if skill exists and belongs to current user
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    if (skill.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ 
        message: 'You are not authorized to add content to this skill' 
      });
    }
    
    // Get count of existing modules to set order
    const moduleCount = await CourseModule.countDocuments({ skillId });
    
    // Create new module
    const newModule = await CourseModule.create({
      name,
      description,
      type,
      skillId,
      order: moduleCount + 1,
      createdBy: req.user.id
    });
    
    res.status(201).json({
      message: 'Module created successfully',
      moduleId: newModule._id
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to create module', 
      error: error.message 
    });
  }
};

// Upload files to a module
export const uploadFiles = async (req, res) => {
  try {
    const { moduleId } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const module = await CourseModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Check if user owns this module
    const skill = await Skill.findById(module.skillId);
    if (skill.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ 
        message: 'You are not authorized to upload to this module' 
      });
    }
    
    // Process and add each file
    const files = req.files.map(file => ({
      name: file.originalname,
      fileUrl: `/uploads/course-content/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadedAt: new Date()
    }));
    
    // Add new files to the module
    module.files = [...module.files, ...files];
    await module.save();
    
    res.status(200).json({
      message: 'Files uploaded successfully',
      files: module.files
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to upload files', 
      error: error.message 
    });
  }
};

// Delete a module
export const deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    
    const module = await CourseModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Check if user owns this module
    const skill = await Skill.findById(module.skillId);
    if (skill.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ 
        message: 'You are not authorized to delete this module' 
      });
    }
    
    // Delete associated files from storage
    module.files.forEach(file => {
      const filePath = path.join(process.cwd(), file.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    
    // Delete the module
    await CourseModule.findByIdAndDelete(moduleId);
    
    // Update order of remaining modules
    const remainingModules = await CourseModule.find({ skillId: module.skillId })
      .sort({ order: 1 });
      
    for (let i = 0; i < remainingModules.length; i++) {
      remainingModules[i].order = i + 1;
      await remainingModules[i].save();
    }
    
    res.status(200).json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete module', 
      error: error.message 
    });
  }
};

// Update a module
export const updateModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { name, description, type, order } = req.body;
    
    const module = await CourseModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Check if user owns this module
    const skill = await Skill.findById(module.skillId);
    if (skill.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ 
        message: 'You are not authorized to update this module' 
      });
    }
    
    // Update module fields
    if (name) module.name = name;
    if (description) module.description = description;
    if (type) module.type = type;
    
    // Handle reordering if order changed
    if (order && order !== module.order) {
      const modules = await CourseModule.find({ skillId: module.skillId })
        .sort({ order: 1 });
      
      // Remove the module from its current position
      const filteredModules = modules.filter(m => m._id.toString() !== moduleId);
      
      // Insert it at the new position
      filteredModules.splice(order - 1, 0, module);
      
      // Reassign orders
      for (let i = 0; i < filteredModules.length; i++) {
        filteredModules[i].order = i + 1;
        await filteredModules[i].save();
      }
    } else {
      await module.save();
    }
    
    res.status(200).json({
      message: 'Module updated successfully',
      module
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to update module', 
      error: error.message 
    });
  }
};

// Delete a file from a module
export const deleteFile = async (req, res) => {
  try {
    const { moduleId, fileId } = req.params;
    
    const module = await CourseModule.findById(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    // Check if user owns this module
    const skill = await Skill.findById(module.skillId);
    if (skill.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ 
        message: 'You are not authorized to delete files from this module' 
      });
    }
    
    // Find the file
    const fileIndex = module.files.findIndex(file => file._id.toString() === fileId);
    if (fileIndex === -1) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Delete the file from storage
    const file = module.files[fileIndex];
    const filePath = path.join(process.cwd(), file.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Remove the file from the module
    module.files.splice(fileIndex, 1);
    await module.save();
    
    res.status(200).json({ 
      message: 'File deleted successfully',
      files: module.files
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to delete file', 
      error: error.message 
    });
  }
};