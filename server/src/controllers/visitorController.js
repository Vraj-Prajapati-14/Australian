const Visitor = require('../models/Visitor');

// Get visitor statistics
const getVisitorStats = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '24h':
        dateFilter = { createdAt: { $gte: new Date(now - 24 * 60 * 60 * 1000) } };
        break;
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        dateFilter = { createdAt: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
    }
    
    // Total visitors in period
    const totalVisitors = await Visitor.countDocuments(dateFilter);
    
    // Unique visitors (by IP)
    const uniqueVisitors = await Visitor.distinct('ip', dateFilter);
    
    // Device type breakdown
    const deviceStats = await Visitor.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Country breakdown
    const countryStats = await Visitor.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Browser breakdown
    const browserStats = await Visitor.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // OS breakdown
    const osStats = await Visitor.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$os', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Daily visitors for chart
    const dailyVisitors = await Visitor.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Returning vs new visitors
    const returningVisitors = await Visitor.countDocuments({
      ...dateFilter,
      isReturning: true
    });
    
    const newVisitors = totalVisitors - returningVisitors;
    
    res.json({
      success: true,
      data: {
        totalVisitors,
        uniqueVisitors: uniqueVisitors.length,
        newVisitors,
        returningVisitors,
        deviceStats,
        countryStats,
        browserStats,
        osStats,
        dailyVisitors,
        period
      }
    });
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching visitor statistics' });
  }
};

// Get recent visitors
const getRecentVisitors = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const visitors = await Visitor.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-userAgent -sessionId');
    
    const total = await Visitor.countDocuments();
    
    res.json({
      success: true,
      data: {
        visitors,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error getting recent visitors:', error);
    res.status(500).json({ success: false, message: 'Error fetching recent visitors' });
  }
};

// Get visitor details
const getVisitorDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const visitor = await Visitor.findById(id);
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found' });
    }
    
    res.json({
      success: true,
      data: visitor
    });
  } catch (error) {
    console.error('Error getting visitor details:', error);
    res.status(500).json({ success: false, message: 'Error fetching visitor details' });
  }
};

module.exports = {
  getVisitorStats,
  getRecentVisitors,
  getVisitorDetails
}; 