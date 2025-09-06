import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

/**
 * Hook to manage dynamic CSS variables based on admin settings
 * Updates CSS custom properties in real-time when settings change
 */
export function useDynamicStyles() {
  // Fetch site settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      try {
        const response = await api.get('/settings');
        return response.data || {};
      } catch (error) {
        console.warn('Could not fetch settings, using defaults:', error);
        return getDefaultSettings();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });

  // Apply dynamic styles to document root
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      applyDynamicStyles(settings);
    }
  }, [settings]);

  return {
    settings,
    isLoading,
    error,
    applyCustomColors: (colors) => applyCustomColors(colors),
    resetToDefaults: () => applyDynamicStyles(getDefaultSettings())
  };
}

/**
 * Apply dynamic styles to CSS custom properties
 */
function applyDynamicStyles(settings) {
  const root = document.documentElement;
  
  // Extract colors from settings
  const appearance = settings.appearance || {};
  const general = settings.general || {};
  
  // Primary color and variations
  const primaryColor = appearance.primaryColor || '#000000';
  const secondaryColor = appearance.secondaryColor || '#ffffff';
  const accentColor = appearance.accentColor || '#fa8c16';
  const textColor = appearance.textColor || '#1a1a1a';
  const backgroundColor = appearance.backgroundColor || '#ffffff';
  
  // Set primary colors
  root.style.setProperty('--primary-color', primaryColor);
  root.style.setProperty('--secondary-color', secondaryColor);
  root.style.setProperty('--accent-color', accentColor);
  root.style.setProperty('--text-color', textColor);
  root.style.setProperty('--background-color', backgroundColor);
  
  // Generate computed colors based on primary color
  const computedColors = generateComputedColors(primaryColor, textColor, backgroundColor);
  Object.entries(computedColors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Apply typography settings
  if (appearance.fontFamily) {
    root.style.setProperty('--font-family', appearance.fontFamily);
  }
  
  if (appearance.fontSize) {
    root.style.setProperty('--font-size-base', appearance.fontSize);
  }
  
  if (appearance.borderRadius) {
    root.style.setProperty('--radius', appearance.borderRadius);
  }
  
  if (appearance.boxShadow) {
    root.style.setProperty('--shadow', appearance.boxShadow);
  }
  
  // Apply brand assets
  if (appearance.logo?.url) {
    root.style.setProperty('--logo-url', `url("${appearance.logo.url}")`);
  }
  
  if (appearance.favicon?.url) {
    // Update favicon dynamically
    updateFavicon(appearance.favicon.url);
  }
  
  // Apply theme class if needed
  applyThemeClass(settings);
  
  console.log('Dynamic styles applied:', {
    primaryColor,
    secondaryColor,
    textColor,
    backgroundColor,
    siteName: general.siteName
  });
}

/**
 * Generate computed colors based on base colors
 */
function generateComputedColors(primaryColor, textColor, backgroundColor) {
  const colors = {};
  
  // Primary color variations
  if (primaryColor === '#000000') {
    colors['--primary-dark'] = '#333333';
    colors['--primary-light'] = '#666666';
  } else {
    // For colored themes, darken/lighten the primary color
    colors['--primary-dark'] = darkenColor(primaryColor, 20);
    colors['--primary-light'] = lightenColor(primaryColor, 20);
  }
  
  // Text color variations
  if (textColor === '#000000' || textColor === '#1a1a1a') {
    colors['--text-secondary'] = '#666666';
    colors['--text-light'] = '#999999';
  } else if (textColor === '#ffffff') {
    colors['--text-secondary'] = '#cccccc';
    colors['--text-light'] = '#999999';
  } else {
    colors['--text-secondary'] = adjustOpacity(textColor, 0.7);
    colors['--text-light'] = adjustOpacity(textColor, 0.5);
  }
  
  // Background color variations
  if (backgroundColor === '#ffffff') {
    colors['--bg-primary'] = '#ffffff';
    colors['--bg-secondary'] = '#f8fafc';
    colors['--bg-tertiary'] = '#f1f5f9';
    colors['--border-color'] = '#e2e8f0';
  } else if (backgroundColor === '#1a1a1a') {
    colors['--bg-primary'] = '#1a1a1a';
    colors['--bg-secondary'] = '#2a2a2a';
    colors['--bg-tertiary'] = '#3a3a3a';
    colors['--border-color'] = '#404040';
  } else {
    // For custom background colors
    colors['--bg-primary'] = backgroundColor;
    colors['--bg-secondary'] = adjustBrightness(backgroundColor, 5);
    colors['--bg-tertiary'] = adjustBrightness(backgroundColor, 10);
    colors['--border-color'] = adjustBrightness(backgroundColor, 15);
  }
  
  return colors;
}

/**
 * Apply custom colors directly (for theme preview)
 */
function applyCustomColors(colors) {
  const root = document.documentElement;
  
  Object.entries(colors).forEach(([property, value]) => {
    if (property.startsWith('--') || property.includes('Color')) {
      const cssProperty = property.startsWith('--') ? property : `--${camelToKebab(property)}`;
      root.style.setProperty(cssProperty, value);
    }
  });
  
  // Generate computed colors
  const primaryColor = colors.primaryColor || colors['--primary-color'];
  const textColor = colors.textColor || colors['--text-color'];
  const backgroundColor = colors.backgroundColor || colors['--background-color'];
  
  if (primaryColor || textColor || backgroundColor) {
    const computedColors = generateComputedColors(primaryColor, textColor, backgroundColor);
    Object.entries(computedColors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }
}

/**
 * Apply theme class to body based on settings
 */
function applyThemeClass(settings) {
  const body = document.body;
  
  // Remove existing theme classes
  body.classList.remove('theme-dark', 'theme-blue', 'theme-green');
  
  const appearance = settings.appearance || {};
  const primaryColor = appearance.primaryColor || '#000000';
  const backgroundColor = appearance.backgroundColor || '#ffffff';
  
  // Apply theme class based on color scheme
  if (backgroundColor === '#1a1a1a' || backgroundColor === '#000000') {
    body.classList.add('theme-dark');
  } else if (primaryColor.includes('#1677ff') || primaryColor.includes('blue')) {
    body.classList.add('theme-blue');
  } else if (primaryColor.includes('#52c41a') || primaryColor.includes('green')) {
    body.classList.add('theme-green');
  }
}

/**
 * Update favicon dynamically
 */
function updateFavicon(faviconUrl) {
  let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = faviconUrl;
  document.getElementsByTagName('head')[0].appendChild(link);
}

/**
 * Get default settings fallback
 */
function getDefaultSettings() {
  return {
    general: {
      siteName: 'Australian Engineering Solutions',
      siteTagline: 'Professional Vehicle Solutions',
      siteDescription: 'Leading mobile workspace solutions and custom engineering services',
      companyName: 'Australian Engineering Solutions'
    },
    appearance: {
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      accentColor: '#fa8c16',
      textColor: '#1a1a1a',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    contact: {
      phone: '+61 2 1234 5678',
      email: 'info@australianengineering.com.au',
      address: '123 Engineering Street, Sydney NSW 2000'
    },
    seo: {
      metaTitle: 'Australian Engineering Solutions - Professional Vehicle Solutions',
      metaDescription: 'Leading provider of mobile workspace solutions and custom engineering services across Australia',
      metaKeywords: 'mobile workspace, engineering solutions, custom engineering, Australia'
    }
  };
}

/**
 * Utility functions for color manipulation
 */
function darkenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function adjustOpacity(color, opacity) {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
}

function adjustBrightness(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function camelToKebab(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}
