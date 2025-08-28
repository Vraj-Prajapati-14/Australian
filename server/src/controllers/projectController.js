const Project = require('../models/Project');

async function list(req, res) {
  try {
    const { service, department, status, featured } = req.query;
    let query = {};

    if (service) query.service = service;
    if (department) query.department = department;
    if (status) query.status = status;
    if (featured === 'true') query.isFeatured = true;

    const projects = await Project.find(query)
      .populate('service', 'title slug')
      .populate('department', 'name color')
      .sort({ createdAt: -1 });
    
    res.json({ data: projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
}

async function getBySlug(req, res) {
  try {
    const { slug } = req.params;
    const project = await Project.findOne({ slug })
      .populate('service', 'title slug')
      .populate('department', 'name color');
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ data: project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Error fetching project' });
  }
}

async function create(req, res) {
  try {
    const project = await Project.create(req.body);
    const populatedProject = await Project.findById(project._id)
      .populate('service', 'title slug')
      .populate('department', 'name color');
    
    res.status(201).json({ data: populatedProject });
  } catch (error) {
    console.error('Error creating project:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Project with this slug already exists' });
    } else {
      res.status(500).json({ message: 'Error creating project' });
    }
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      .populate('service', 'title slug')
      .populate('department', 'name color');
    
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ data: project });
  } catch (error) {
    console.error('Error updating project:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Project with this slug already exists' });
    } else {
      res.status(500).json({ message: 'Error updating project' });
    }
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
}

module.exports = { list, getBySlug, create, update, remove };

