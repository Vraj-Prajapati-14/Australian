const Visitor = require('../models/Visitor');
const UAParser = require('ua-parser-js');

// Track visitor with comprehensive data
const trackVisitor = async (req, res) => {
  try {
    const {
      page,
      referrer,
      screenResolution,
      viewportSize,
      colorDepth,
      pixelRatio,
      deviceMemory,
      hardwareConcurrency,
      connectionType,
      connectionSpeed,
      language,
      timezone,
      email,
      name,
      socialAccounts,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      customData,
      consentGiven
    } = req.body;

    // Get IP address
    const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    
    // Parse user agent
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const uaResult = parser.getResult();
    
    // Generate session ID if not exists
    let sessionId = req.cookies?.sessionId;
    if (!sessionId) {
      sessionId = require('crypto').randomBytes(32).toString('hex');
      res.cookie('sessionId', sessionId, { 
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    }

    // Check if returning visitor
    const existingVisitor = await Visitor.findOne({ 
      $or: [
        { ip },
        { sessionId },
        ...(email ? [{ email }] : [])
      ]
    });

    // Get location data (you can integrate with IP geolocation service)
    const locationData = await getLocationFromIP(ip);

    // Create visitor data
    const visitorData = {
      ip,
      sessionId,
      userAgent,
      deviceType: getDeviceType(uaResult.device.type),
      browser: uaResult.browser.name,
      browserVersion: uaResult.browser.version,
      os: uaResult.os.name,
      osVersion: uaResult.os.version,
      screenResolution,
      viewportSize,
      colorDepth,
      pixelRatio,
      deviceMemory,
      hardwareConcurrency,
      connectionType,
      connectionSpeed,
      language,
      timezone,
      ...locationData,
      referrer,
      page,
      entryPage: existingVisitor ? existingVisitor.entryPage : page,
      isReturning: !!existingVisitor,
      email,
      name,
      socialAccounts,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
      customData,
      consentGiven,
      consentTimestamp: consentGiven ? new Date() : null,
      lastActivity: new Date()
    };

    // Update existing visitor or create new one
    let visitor;
    if (existingVisitor) {
      // Update existing visitor
      visitor = await Visitor.findByIdAndUpdate(
        existingVisitor._id,
        {
          $inc: { pageViews: 1 },
          $set: {
            lastActivity: new Date(),
            lastSeen: new Date(),
            page,
            previousPage: existingVisitor.page,
            browser: uaResult.browser.name,
            browserVersion: uaResult.browser.version,
            os: uaResult.os.name,
            osVersion: uaResult.os.version,
            ...(email && { email }),
            ...(name && { name }),
            ...(socialAccounts && { socialAccounts }),
            ...(consentGiven && { consentGiven, consentTimestamp: new Date() })
          }
        },
        { new: true }
      );
    } else {
      // Create new visitor
      visitor = await Visitor.create(visitorData);
    }

    res.json({
      success: true,
      data: {
        visitorId: visitor._id,
        sessionId,
        isReturning: !!existingVisitor
      }
    });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ success: false, message: 'Error tracking visitor' });
  }
};

// Get comprehensive analytics data
const getAnalytics = async (req, res) => {
  try {
    const { period = '30d', startDate, endDate } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    if (startDate && endDate) {
      dateFilter = { 
        createdAt: { 
          $gte: new Date(startDate), 
          $lte: new Date(endDate) 
        } 
      };
    } else {
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
          dateFilter = { createdAt: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
      }
    }
    
    // Overview metrics
    const totalVisitors = await Visitor.countDocuments(dateFilter);
    const uniqueVisitors = await Visitor.distinct('ip', dateFilter);
    const totalPageViews = await Visitor.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: '$pageViews' } } }
    ]);
    
    // Device breakdown
    const deviceStats = await Visitor.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
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
    
    // Country breakdown
    const countryStats = await Visitor.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Social accounts breakdown
    const socialStats = await Visitor.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          google: { $sum: { $cond: [{ $ne: ['$socialAccounts.google', null] }, 1, 0] } },
          facebook: { $sum: { $cond: [{ $ne: ['$socialAccounts.facebook', null] }, 1, 0] } },
          twitter: { $sum: { $cond: [{ $ne: ['$socialAccounts.twitter', null] }, 1, 0] } },
          linkedin: { $sum: { $cond: [{ $ne: ['$socialAccounts.linkedin', null] }, 1, 0] } },
          github: { $sum: { $cond: [{ $ne: ['$socialAccounts.github', null] }, 1, 0] } }
        }
      }
    ]);
    
    // Daily visitors for trends
    const dailyVisitors = await Visitor.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          visitors: { $sum: 1 },
          pageViews: { $sum: '$pageViews' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Top pages
    const topPages = await Visitor.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$page', views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);
    
    // Email accounts breakdown
    const emailStats = await Visitor.aggregate([
      { $match: { ...dateFilter, email: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: {
            domain: { $substr: ['$email', { $indexOfBytes: ['$email', '@'] }, -1] }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Connection types
    const connectionStats = await Visitor.aggregate([
      { $match: { ...dateFilter, connectionType: { $exists: true, $ne: null } } },
      { $group: { _id: '$connectionType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Screen resolutions
    const resolutionStats = await Visitor.aggregate([
      { $match: { ...dateFilter, screenResolution: { $exists: true, $ne: null } } },
      { $group: { _id: '$screenResolution', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Returning vs new visitors
    const returningVisitors = await Visitor.countDocuments({
      ...dateFilter,
      isReturning: true
    });
    
    const newVisitors = totalVisitors - returningVisitors;
    
    // Calculate conversion rate (visitors with email)
    const visitorsWithEmail = await Visitor.countDocuments({
      ...dateFilter,
      email: { $exists: true, $ne: null }
    });
    
    const conversionRate = totalVisitors > 0 ? ((visitorsWithEmail / totalVisitors) * 100).toFixed(2) : 0;
    
    res.json({
      success: true,
      data: {
        overview: {
          totalVisitors,
          uniqueVisitors: uniqueVisitors.length,
          totalPageViews: totalPageViews[0]?.total || 0,
          newVisitors,
          returningVisitors,
          conversionRate: `${conversionRate}%`,
          avgSessionDuration: '2m 30s', // You can calculate this from visitDuration
          bounceRate: '45%' // You can calculate this from single page visits
        },
        traffic: {
          sources: [
            { source: 'Direct', visitors: Math.floor(totalVisitors * 0.4), percentage: 40 },
            { source: 'Organic Search', visitors: Math.floor(totalVisitors * 0.3), percentage: 30 },
            { source: 'Social Media', visitors: Math.floor(totalVisitors * 0.2), percentage: 20 },
            { source: 'Referral', visitors: Math.floor(totalVisitors * 0.1), percentage: 10 }
          ],
          devices: deviceStats.map(device => ({
            device: device._id || 'Unknown',
            visitors: device.count,
            percentage: ((device.count / totalVisitors) * 100).toFixed(1)
          })),
          countries: countryStats.map(country => ({
            country: country._id || 'Unknown',
            visitors: country.count,
            percentage: ((country.count / totalVisitors) * 100).toFixed(1)
          }))
        },
        pages: topPages.map(page => ({
          page: page._id || 'Unknown',
          views: page.views,
          uniqueViews: page.views,
          avgTime: '1m 30s',
          bounceRate: '45%'
        })),
        trends: {
          daily: dailyVisitors.map(day => ({
            date: day._id,
            visitors: day.visitors,
            pageViews: day.pageViews
          }))
        },
        detailed: {
          browsers: browserStats,
          operatingSystems: osStats,
          socialAccounts: socialStats[0] || {},
          emailDomains: emailStats,
          connectionTypes: connectionStats,
          screenResolutions: resolutionStats
        }
      }
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics data' });
  }
};

// Get recent visitors with detailed information
const getRecentVisitors = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    
    const visitors = await Visitor.find()
      .sort({ lastSeen: -1 })
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

// Helper functions
const getDeviceType = (deviceType) => {
  if (!deviceType) return 'desktop';
  return deviceType === 'mobile' ? 'mobile' : 
         deviceType === 'tablet' ? 'tablet' : 'desktop';
};

const getLocationFromIP = async (ip) => {
  // This is a placeholder - you can integrate with services like:
  // - ipapi.co
  // - ipinfo.io
  // - maxmind.com
  // For now, return basic data
  return {
    city: 'Unknown',
    country: 'Unknown',
    region: 'Unknown',
    timezone: 'UTC',
    latitude: null,
    longitude: null,
    isp: 'Unknown'
  };
};

module.exports = {
  trackVisitor,
  getAnalytics,
  getRecentVisitors,
  getVisitorDetails
}; 