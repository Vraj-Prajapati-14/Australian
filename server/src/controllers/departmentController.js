const Department = require('../models/Department');

async function list(req, res) {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }

    const departments = await Department.find(query)
      .sort({ order: 1, name: 1 });
    
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching departments', error: error.message });
  }
}

async function create(req, res) {
  try {
    const { name, description, status, order, color } = req.body;
    
    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Department name is required' });
    }
    
    if (name.trim().length < 2) {
      return res.status(400).json({ message: 'Department name must be at least 2 characters long' });
    }
    
    if (order && (isNaN(order) || order < 0)) {
      return res.status(400).json({ message: 'Order must be a positive number' });
    }
    
    if (status && !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either active or inactive' });
    }
    
    const departmentData = {
      name: name.trim(),
      description: description ? description.trim() : '',
      status: status || 'active',
      order: order || 0,
      color: color || '#1677ff'
    };
    
    const department = await Department.create(departmentData);
    res.status(201).json(department);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Department name already exists' });
    } else {
      res.status(500).json({ message: 'Error creating department', error: error.message });
    }
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json(department);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Department name already exists' });
    } else {
      res.status(500).json({ message: 'Error updating department', error: error.message });
    }
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const department = await Department.findByIdAndDelete(id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    
    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting department', error: error.message });
  }
}

async function getActive(req, res) {
  try {
    const departments = await Department.find({ status: 'active' })
      .sort({ order: 1, name: 1 });
    
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active departments', error: error.message });
  }
}

module.exports = { list, create, update, remove, getActive }; 