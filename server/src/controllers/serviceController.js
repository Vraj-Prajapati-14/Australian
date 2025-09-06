const Service = require('../models/Service');

async function list(req, res) {
  try {
    const { type, department, featured, status } = req.query;
    let query = {};

    // Only filter by status if not requesting all
    if (status !== 'all') {
      query.status = 'active';
    }

    if (type === 'main') {
      query.isMainService = true;
    } else if (type === 'sub') {
      query.isMainService = false;
      query.parentService = { $exists: true, $ne: null };
    }

    if (department) {
      query.department = department;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const services = await Service.find(query)
      .populate('department', 'name color')
      .populate('parentService', 'title slug')
      .populate('subServices', 'title slug shortDescription heroImage status')
      .sort({ order: 1, createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
}

async function getMainServices(req, res) {
  try {
    const services = await Service.find({ 
      isMainService: true, 
      status: 'active' 
    })
    .populate('department', 'name color')
    .populate('subServices', 'title slug shortDescription heroImage status')
    .sort({ order: 1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching main services', error: error.message });
  }
}

async function getSubServices(req, res) {
  try {
    const { parentId } = req.params;
    const subServices = await Service.find({ 
      parentService: parentId, 
      status: 'active' 
    })
    .populate('department', 'name color')
    .populate('parentService', 'title slug')
    .sort({ order: 1 });

    res.json(subServices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sub services', error: error.message });
  }
}

async function getAllSubServices(req, res) {
  try {
    const subServices = await Service.find({ 
      isMainService: false,
      parentService: { $exists: true, $ne: null },
      status: 'active' 
    })
    .populate('department', 'name color')
    .populate('parentService', 'title slug')
    .sort({ order: 1 });

    res.json(subServices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all sub services', error: error.message });
  }
}

async function getBySlug(req, res) {
  try {
    const { slug } = req.params;
    const service = await Service.findOne({ slug, status: 'active' })
      .populate('department', 'name color')
      .populate('parentService', 'title slug')
      .populate('subServices', 'title slug shortDescription heroImage status');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
}

async function create(req, res) {
  try {
    console.log('Creating service with data:', req.body);
    console.log('Request headers:', req.headers);
    
    // Validate required fields
    const { title, slug } = req.body;
    console.log('Extracted fields:', { title, slug });
    
    if (!title || !slug) {
      console.log('Missing required fields:', { title, slug });
      return res.status(400).json({ 
        message: 'Missing required fields', 
        required: ['title', 'slug'],
        received: { title, slug }
      });
    }

    // Check if slug already exists
    console.log('Checking for existing slug:', slug);
    const existingService = await Service.findOne({ slug });
    if (existingService) {
      console.log('Slug already exists:', slug);
      return res.status(400).json({ 
        message: 'Service with this slug already exists',
        slug 
      });
    }
    console.log('Slug is unique:', slug);

    console.log('Creating service in database with data:', req.body);
    const service = await Service.create(req.body);
    console.log('Service created with ID:', service._id);
    
    // If this is a sub-service, update the parent service's subServices array
    if (service.parentService) {
      console.log('Updating parent service:', service.parentService);
      await Service.findByIdAndUpdate(
        service.parentService,
        { $push: { subServices: service._id } }
      );
      console.log('Parent service updated');
    }

    const populatedService = await Service.findById(service._id)
      .populate('department', 'name color')
      .populate('parentService', 'title slug')
      .populate('subServices', 'title slug shortDescription heroImage');

    console.log('Service created successfully:', populatedService._id);
    res.status(201).json(populatedService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ 
      message: 'Error creating service', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    console.log('Updating service:', id, 'with data:', req.body);
    
    const oldService = await Service.findById(id);
    
    if (!oldService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const service = await Service.findByIdAndUpdate(id, req.body, { new: true })
      .populate('department', 'name color')
      .populate('parentService', 'title slug')
      .populate('subServices', 'title slug shortDescription heroImage');

    // Handle parent service changes
    if (oldService.parentService && oldService.parentService.toString() !== req.body.parentService) {
      // Remove from old parent
      await Service.findByIdAndUpdate(
        oldService.parentService,
        { $pull: { subServices: service._id } }
      );
    }

    if (req.body.parentService && (!oldService.parentService || oldService.parentService.toString() !== req.body.parentService)) {
      // Add to new parent
      await Service.findByIdAndUpdate(
        req.body.parentService,
        { $push: { subServices: service._id } }
      );
    }

    console.log('Service updated successfully:', service._id);
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ 
      message: 'Error updating service', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Remove from parent service if it's a sub-service
    if (service.parentService) {
      await Service.findByIdAndUpdate(
        service.parentService,
        { $pull: { subServices: service._id } }
      );
    }

    // Delete all sub-services if it's a main service
    if (service.isMainService) {
      await Service.deleteMany({ parentService: service._id });
    }

    await Service.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
}

async function getFeatured(req, res) {
  try {
    const services = await Service.find({ 
      isFeatured: true, 
      status: 'active' 
    })
    .populate('department', 'name color')
    .populate('parentService', 'title slug')
    .sort({ order: 1 })
    .limit(6);

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured services', error: error.message });
  }
}

module.exports = { 
  list, 
  getMainServices, 
  getSubServices, 
  getAllSubServices,
  getBySlug, 
  create, 
  update, 
  remove, 
  getFeatured 
};

