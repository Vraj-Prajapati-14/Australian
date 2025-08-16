const Visitor = require('../models/Visitor');
const UAParser = require('ua-parser-js');

const visitorTracker = async (req, res, next) => {
  try {
    // Skip tracking for admin routes and API calls
    if (req.path.startsWith('/admin') || req.path.startsWith('/api')) {
      return next();
    }

    const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers.referer || '';
    
    // Parse user agent
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    // Determine device type
    let deviceType = 'desktop';
    if (result.device.type === 'mobile') deviceType = 'mobile';
    else if (result.device.type === 'tablet') deviceType = 'tablet';
    
    // Generate session ID (simple hash of IP + timestamp)
    const sessionId = require('crypto').createHash('md5').update(ip + Date.now()).digest('hex');
    
    // Check if this IP has visited before
    const existingVisitor = await Visitor.findOne({ ip }).sort({ createdAt: -1 });
    const isReturning = !!existingVisitor;
    
    // Create visitor record
    const visitor = new Visitor({
      ip,
      userAgent,
      deviceType,
      browser: result.browser.name,
      os: result.os.name,
      city: req.headers['x-forwarded-city'] || 'Unknown',
      country: req.headers['x-forwarded-country'] || 'Unknown',
      region: req.headers['x-forwarded-region'] || 'Unknown',
      timezone: req.headers['x-forwarded-timezone'] || 'Unknown',
      referrer,
      page: req.path,
      sessionId,
      isReturning,
      lastActivity: new Date(),
    });
    
    await visitor.save();
    
    // Add visitor info to request for potential use
    req.visitorInfo = {
      sessionId,
      isReturning,
      deviceType,
      country: visitor.country,
    };
    
  } catch (error) {
    console.error('Visitor tracking error:', error);
    // Don't block the request if tracking fails
  }
  
  next();
};

module.exports = visitorTracker; 