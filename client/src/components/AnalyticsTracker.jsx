import { useEffect, useRef } from 'react';
import { api } from '../lib/api';

const AnalyticsTracker = ({ page, email, name, socialAccounts, customData }) => {
  const sessionStartTime = useRef(Date.now());
  const lastActivityTime = useRef(Date.now());
  const pageViews = useRef(0);
  const clicks = useRef(0);
  const maxScrollDepth = useRef(0);
  const timeOnPage = useRef(0);
  const isTracking = useRef(false);

  // Collect device and browser information
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const screen = window.screen;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    return {
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      colorDepth: screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1,
      deviceMemory: navigator.deviceMemory || null,
      hardwareConcurrency: navigator.hardwareConcurrency || null,
      connectionType: connection ? connection.effectiveType || connection.type : null,
      connectionSpeed: connection ? connection.downlink : null,
      language: navigator.language || navigator.userLanguage,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      acceptsCookies: navigator.cookieEnabled,
      acceptsJavaScript: true,
      acceptsImages: true
    };
  };

  // Detect social media accounts from page content
  const detectSocialAccounts = () => {
    const socialAccounts = {};
    
    // Check for Google account
    if (document.querySelector('[data-google-id]') || window.gapi) {
      socialAccounts.google = 'detected';
    }
    
    // Check for Facebook account
    if (document.querySelector('[data-facebook-id]') || window.FB) {
      socialAccounts.facebook = 'detected';
    }
    
    // Check for Twitter account
    if (document.querySelector('[data-twitter-id]') || window.twttr) {
      socialAccounts.twitter = 'detected';
    }
    
    // Check for LinkedIn account
    if (document.querySelector('[data-linkedin-id]') || window.linkedin) {
      socialAccounts.linkedin = 'detected';
    }
    
    // Check for GitHub account
    if (document.querySelector('[data-github-id]') || window.location.hostname.includes('github')) {
      socialAccounts.github = 'detected';
    }
    
    return socialAccounts;
  };

  // Get UTM parameters from URL
  const getUTMParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utmSource: urlParams.get('utm_source'),
      utmMedium: urlParams.get('utm_medium'),
      utmCampaign: urlParams.get('utm_campaign'),
      utmTerm: urlParams.get('utm_term'),
      utmContent: urlParams.get('utm_content')
    };
  };

  // Track user engagement
  const trackEngagement = () => {
    // Track clicks
    const handleClick = () => {
      clicks.current++;
      lastActivityTime.current = Date.now();
    };

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent;
      }
      lastActivityTime.current = Date.now();
    };

    // Track time on page
    const updateTimeOnPage = () => {
      timeOnPage.current = Math.floor((Date.now() - sessionStartTime.current) / 1000);
    };

    // Add event listeners
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
    
    // Update time on page every second
    const timeInterval = setInterval(updateTimeOnPage, 1000);

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
    };
  };

  // Send tracking data to server
  const sendTrackingData = async (additionalData = {}) => {
    if (isTracking.current) return;
    isTracking.current = true;

    try {
      const deviceInfo = getDeviceInfo();
      const detectedSocialAccounts = detectSocialAccounts();
      const utmParams = getUTMParams();

      const trackingData = {
        page: page || window.location.pathname,
        referrer: document.referrer,
        email,
        name,
        socialAccounts: { ...detectedSocialAccounts, ...socialAccounts },
        customData,
        consentGiven: true, // Assuming consent is given if tracker is loaded
        ...deviceInfo,
        ...utmParams,
        ...additionalData
      };

      await api.post('/visitors/track', trackingData);
      pageViews.current++;
      
    } catch (error) {
      console.error('Error tracking visitor:', error);
    } finally {
      isTracking.current = false;
    }
  };

  // Send final data when user leaves
  const sendFinalData = () => {
    const finalData = {
      pageViews: pageViews.current,
      clicks: clicks.current,
      scrollDepth: Math.round(maxScrollDepth.current),
      timeOnPage: timeOnPage.current,
      visitDuration: Math.floor((Date.now() - sessionStartTime.current) / 1000)
    };

    // Use sendBeacon for reliable data sending on page unload
    if (navigator.sendBeacon) {
      const data = JSON.stringify({
        page: page || window.location.pathname,
        ...finalData
      });
      navigator.sendBeacon('/api/visitors/track', data);
    } else {
      // Fallback to regular fetch
      sendTrackingData(finalData);
    }
  };

  useEffect(() => {
    // Initial tracking
    sendTrackingData();

    // Track engagement
    const cleanup = trackEngagement();

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, update last activity
        lastActivityTime.current = Date.now();
      } else {
        // Page is visible again, update session start time
        sessionStartTime.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track before unload
    window.addEventListener('beforeunload', sendFinalData);
    window.addEventListener('pagehide', sendFinalData);

    // Periodic tracking updates (every 30 seconds)
    const interval = setInterval(() => {
      if (Date.now() - lastActivityTime.current < 300000) { // 5 minutes
        sendTrackingData({
          pageViews: pageViews.current,
          clicks: clicks.current,
          scrollDepth: Math.round(maxScrollDepth.current),
          timeOnPage: timeOnPage.current
        });
      }
    }, 30000);

    return () => {
      cleanup();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', sendFinalData);
      window.removeEventListener('pagehide', sendFinalData);
      clearInterval(interval);
      sendFinalData();
    };
  }, [page, email, name, socialAccounts, customData]);

  // Return null as this is a tracking component
  return null;
};

export default AnalyticsTracker; 