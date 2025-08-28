const CaseStudy = require('../models/CaseStudy');

// Get all case studies
exports.list = async (req, res) => {
  try {
    const { status, featured, service, department, limit = 50 } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (service) {
      query.service = service;
    }

    if (department) {
      query.department = department;
    }
    
    const caseStudies = await CaseStudy.find(query)
      .populate('service', 'title slug')
      .populate('department', 'name color')
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({ data: caseStudies });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    res.status(500).json({ message: 'Error fetching case studies' });
  }
};

// Get case study by slug
exports.getBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const caseStudy = await CaseStudy.findOne({ slug, status: 'active' })
      .populate('service', 'title slug')
      .populate('department', 'name color');
    
    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }
    
    res.json({ data: caseStudy });
  } catch (error) {
    console.error('Error fetching case study:', error);
    res.status(500).json({ message: 'Error fetching case study' });
  }
};

// Create new case study
exports.create = async (req, res) => {
  try {
    const caseStudyData = req.body;
    
    // Generate slug if not provided
    if (!caseStudyData.slug && caseStudyData.title) {
      caseStudyData.slug = caseStudyData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const caseStudy = new CaseStudy(caseStudyData);
    await caseStudy.save();
    
    const populatedCaseStudy = await CaseStudy.findById(caseStudy._id)
      .populate('service', 'title slug')
      .populate('department', 'name color');
    
    res.status(201).json({ data: populatedCaseStudy });
  } catch (error) {
    console.error('Error creating case study:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Case study with this slug already exists' });
    } else {
      res.status(500).json({ message: 'Error creating case study' });
    }
  }
};

// Update case study
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Generate slug if title changed and slug not provided
    if (updateData.title && !updateData.slug) {
      updateData.slug = updateData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const caseStudy = await CaseStudy.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('service', 'title slug')
    .populate('department', 'name color');
    
    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }
    
    res.json({ data: caseStudy });
  } catch (error) {
    console.error('Error updating case study:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Case study with this slug already exists' });
    } else {
      res.status(500).json({ message: 'Error updating case study' });
    }
  }
};

// Delete case study
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const caseStudy = await CaseStudy.findByIdAndDelete(id);
    
    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }
    
    res.json({ message: 'Case study deleted successfully' });
  } catch (error) {
    console.error('Error deleting case study:', error);
    res.status(500).json({ message: 'Error deleting case study' });
  }
}; 