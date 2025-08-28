const Testimonial = require('../models/Testimonial');
const { uploadToCloudinary, deleteFromCloudinary } = require('../lib/cloudinary');

// Get all testimonials (admin)
const getAllTestimonials = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, featured, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build query
    const query = {};
    if (status && status.trim() !== '') query.status = status;
    if (featured !== undefined && featured !== '') query.featured = featured === 'true';
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }



    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const totalDocs = await Testimonial.countDocuments(query);

    // Get testimonials with pagination
    const testimonials = await Testimonial.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('approvedBy', 'name email');

    // Calculate pagination info
    const totalPages = Math.ceil(totalDocs / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      success: true,
      data: testimonials,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalDocs,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
      error: error.message
    });
  }
};

// Get public testimonials (for home page)
const getPublicTestimonials = async (req, res) => {
  try {
    const { limit = 6, featured } = req.query;

    const query = { status: 'approved' };
    if (featured === 'true') query.featured = true;

    const testimonials = await Testimonial.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .select('name position company content rating avatar createdAt');

    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching public testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
      error: error.message
    });
  }
};

// Get single testimonial
const getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id)
      .populate('approvedBy', 'name email');

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonial',
      error: error.message
    });
  }
};

// Create testimonial (public)
const createTestimonial = async (req, res) => {
  try {
    const {
      name,
      position,
      company,
      content,
      rating,
      email,
      phone
    } = req.body;

    // Get client IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Handle avatar upload if provided
    let avatar = {};
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, 'testimonials');
      avatar = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    }

    const testimonial = new Testimonial({
      name,
      position,
      company,
      content,
      rating: parseInt(rating),
      email,
      phone,
      avatar,
      ipAddress,
      userAgent,
      source: 'public'
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully! It will be reviewed before being published.',
      data: testimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit testimonial',
      error: error.message
    });
  }
};

// Create testimonial (admin)
  const createTestimonialAdmin = async (req, res) => {
    try {
    
    const {
      name,
      position,
      company,
      content,
      rating,
      email,
      phone,
      featured,
      status,
      notes
    } = req.body;

    // Handle avatar upload if provided
    let avatar = {};
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path, 'testimonials');
      avatar = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    }



    const testimonial = new Testimonial({
      name,
      position,
      company,
      content,
      rating: parseInt(rating),
      email,
      phone,
      avatar,
      featured: featured === 'true',
      status: status || 'approved',
      notes,
      source: 'admin',
      approvedAt: status === 'approved' ? new Date() : null,
      approvedBy: status === 'approved' ? req.user.id : null
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create testimonial',
      error: error.message
    });
  }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    const {
      name,
      position,
      company,
      content,
      rating,
      email,
      phone,
      featured,
      status,
      notes
    } = req.body;

    // Handle avatar upload if provided
    if (req.file) {
      // Delete old avatar if exists
      if (testimonial.avatar.publicId) {
        await deleteFromCloudinary(testimonial.avatar.publicId);
      }

      const uploadResult = await uploadToCloudinary(req.file.path, 'testimonials');
      testimonial.avatar = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      };
    }

    // Update fields
    testimonial.name = name || testimonial.name;
    testimonial.position = position || testimonial.position;
    testimonial.company = company || testimonial.company;
    testimonial.content = content || testimonial.content;
    testimonial.rating = rating ? parseInt(rating) : testimonial.rating;
    testimonial.email = email || testimonial.email;
    testimonial.phone = phone || testimonial.phone;
    testimonial.featured = featured !== undefined ? featured === 'true' : testimonial.featured;
    testimonial.notes = notes || testimonial.notes;

    // Handle status change
    if (status && status !== testimonial.status) {
      testimonial.status = status;
      if (status === 'approved') {
        testimonial.approvedAt = new Date();
        testimonial.approvedBy = req.user.id;
      } else {
        testimonial.approvedAt = null;
        testimonial.approvedBy = null;
      }
    }

    await testimonial.save();

    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update testimonial',
      error: error.message
    });
  }
};

// Delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    // Delete avatar from cloudinary if exists
    if (testimonial.avatar.publicId) {
      await deleteFromCloudinary(testimonial.avatar.publicId);
    }

    await Testimonial.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial',
      error: error.message
    });
  }
};

// Bulk update testimonials
const bulkUpdateTestimonials = async (req, res) => {
  try {
    const { ids, action, value } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide testimonial IDs'
      });
    }

    let updateData = {};
    let message = '';

    switch (action) {
      case 'approve':
        updateData = {
          status: 'approved',
          approvedAt: new Date(),
          approvedBy: req.user.id
        };
        message = 'Testimonials approved successfully';
        break;
      case 'reject':
        updateData = {
          status: 'rejected',
          approvedAt: null,
          approvedBy: null
        };
        message = 'Testimonials rejected successfully';
        break;
      case 'feature':
        updateData = { featured: value === 'true' };
        message = value === 'true' ? 'Testimonials featured successfully' : 'Testimonials unfeatured successfully';
        break;
      case 'delete':
        // Delete avatars from cloudinary
        const testimonials = await Testimonial.find({ _id: { $in: ids } });
        for (const testimonial of testimonials) {
          if (testimonial.avatar.publicId) {
            await deleteFromCloudinary(testimonial.avatar.publicId);
          }
        }
        await Testimonial.deleteMany({ _id: { $in: ids } });
        return res.json({
          success: true,
          message: 'Testimonials deleted successfully'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    await Testimonial.updateMany(
      { _id: { $in: ids } },
      updateData
    );

    res.json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Error bulk updating testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update testimonials',
      error: error.message
    });
  }
};

// Get testimonials statistics
const getTestimonialStats = async (req, res) => {
  try {

    
    const stats = await Testimonial.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          },
          featured: {
            $sum: { $cond: ['$featured', 1, 0] }
          },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    const recentTestimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name company status createdAt');



    res.json({
      success: true,
      data: {
        stats: stats[0] || {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          featured: 0,
          avgRating: 0
        },
        recentTestimonials
      }
    });
  } catch (error) {
    console.error('Error fetching testimonial stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonial statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllTestimonials,
  getPublicTestimonials,
  getTestimonial,
  createTestimonial,
  createTestimonialAdmin,
  updateTestimonial,
  deleteTestimonial,
  bulkUpdateTestimonials,
  getTestimonialStats
}; 