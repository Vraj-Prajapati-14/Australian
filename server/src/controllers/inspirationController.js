const mongoose = require('mongoose');
const Inspiration = require('../models/Inspiration');

// Get all inspiration items (admin)
const getAllInspiration = async (req, res) => {
  try {
    const { service, department, status, featured } = req.query;
    let query = {};

    if (service) query.service = service;
    if (department) query.department = department;
    if (status) query.status = status;
    if (featured === 'true') query.isFeatured = true;

    const inspiration = await Inspiration.find(query)
      .populate('service', 'title slug')
      .populate('department', 'name color')
      .sort({ order: 1, createdAt: -1 });
    
    res.json({ data: inspiration });
  } catch (error) {
    console.error('Error fetching inspiration:', error);
    res.status(500).json({ message: 'Error fetching inspiration items', error: error.message });
  }
};

// Get published inspiration items (public)
const getPublishedInspiration = async (req, res) => {
  try {
    const { service, department, search, featured } = req.query;
    
    let query = { status: 'published' };
    
    if (service && service !== 'all') {
      query.service = service;
    }

    if (department && department !== 'all') {
      query.department = department;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const inspiration = await Inspiration.find(query)
      .populate('service', 'title slug')
      .populate('department', 'name color')
      .sort({ order: 1, createdAt: -1 });
    
    res.json({ data: inspiration });
  } catch (error) {
    console.error('Error fetching published inspiration:', error);
    res.status(500).json({ message: 'Error fetching inspiration items', error: error.message });
  }
};

// Get single inspiration item
const getInspirationById = async (req, res) => {
  try {
    const inspiration = await Inspiration.findById(req.params.id)
      .populate('service', 'title slug')
      .populate('department', 'name color');
    
    if (!inspiration) {
      return res.status(404).json({ message: 'Inspiration item not found' });
    }
    
    res.json({ data: inspiration });
  } catch (error) {
    console.error('Error fetching inspiration item:', error);
    res.status(500).json({ message: 'Error fetching inspiration item', error: error.message });
  }
};

// Create new inspiration item
const createInspiration = async (req, res) => {
  try {
    const { title, service, department, description, tags, status, isFeatured, order, image } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        required: ['title', 'description'] 
      });
    }

    // Validate image data - image should be an object with url and publicId
    if (!image || !image.url || !image.publicId) {
      return res.status(400).json({ 
        message: 'Image data is required. Please upload an image first.', 
        required: ['image.url', 'image.publicId'] 
      });
    }
    
    const inspiration = new Inspiration({
      title,
      service,
      department,
      description,
      image: {
        url: image.url,
        publicId: image.publicId,
        alt: image.alt || title
      },
      tags: tags || [],
      status: status || 'draft',
      isFeatured: isFeatured || false,
      order: order || 0
    });
    
    await inspiration.save();
    
    const populatedInspiration = await Inspiration.findById(inspiration._id)
      .populate('service', 'title slug')
      .populate('department', 'name color');
    
    res.status(201).json({ data: populatedInspiration, message: 'Inspiration item created successfully' });
  } catch (error) {
    console.error('Error creating inspiration:', error);
    res.status(500).json({ message: 'Error creating inspiration item', error: error.message });
  }
};

// Update inspiration item
const updateInspiration = async (req, res) => {
  try {
    const { title, service, department, description, tags, status, isFeatured, order, image } = req.body;
    
    const updateData = {
      title,
      service,
      department,
      description,
      tags: tags || [],
      status,
      isFeatured,
      order
    };

    // Handle image update if provided
    if (image && image.url && image.publicId) {
      updateData.image = {
        url: image.url,
        publicId: image.publicId,
        alt: image.alt || title
      };
    }
    
    const inspiration = await Inspiration.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('service', 'title slug')
    .populate('department', 'name color');
    
    if (!inspiration) {
      return res.status(404).json({ message: 'Inspiration item not found' });
    }
    
    res.json({ data: inspiration, message: 'Inspiration item updated successfully' });
  } catch (error) {
    console.error('Error updating inspiration:', error);
    res.status(500).json({ message: 'Error updating inspiration item', error: error.message });
  }
};

// Delete inspiration item
const deleteInspiration = async (req, res) => {
  try {
    const inspiration = await Inspiration.findById(req.params.id);
    
    if (!inspiration) {
      return res.status(404).json({ message: 'Inspiration item not found' });
    }
    
    await Inspiration.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Inspiration item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inspiration:', error);
    res.status(500).json({ message: 'Error deleting inspiration item', error: error.message });
  }
};

// Update inspiration order
const updateInspirationOrder = async (req, res) => {
  try {
    const { items } = req.body;
    
    for (const item of items) {
      await Inspiration.findByIdAndUpdate(item.id, { order: item.order });
    }
    
    res.json({ message: 'Inspiration order updated successfully' });
  } catch (error) {
    console.error('Error updating inspiration order:', error);
    res.status(500).json({ message: 'Error updating inspiration order', error: error.message });
  }
};

// Export all functions
module.exports = {
  getAllInspiration,
  getPublishedInspiration,
  getInspirationById,
  createInspiration,
  updateInspiration,
  deleteInspiration,
  updateInspirationOrder
}; 