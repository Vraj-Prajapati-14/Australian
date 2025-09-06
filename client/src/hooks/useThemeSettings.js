import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useThemeSettings = () => {
  const { data: settings = {} } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await api.get('/settings');
      return response.data || {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (settings && settings.appearance) {
      const root = document.documentElement;
      const appearance = settings.appearance;

      // Update color variables
      if (appearance.primaryColor) {
        root.style.setProperty('--primary-color', appearance.primaryColor);
      }
      if (appearance.secondaryColor) {
        root.style.setProperty('--secondary-color', appearance.secondaryColor);
      }
      if (appearance.accentColor) {
        root.style.setProperty('--accent-color', appearance.accentColor);
      }
      if (appearance.textColor) {
        root.style.setProperty('--text-color', appearance.textColor);
      }
      if (appearance.backgroundColor) {
        root.style.setProperty('--background-color', appearance.backgroundColor);
      }

      // Update typography variables
      if (appearance.fontFamily) {
        root.style.setProperty('--font-family', appearance.fontFamily);
      }
      if (appearance.fontSize) {
        root.style.setProperty('--font-size-base', appearance.fontSize);
      }

      // Update border radius
      if (appearance.borderRadius) {
        root.style.setProperty('--border-radius-md', appearance.borderRadius);
        root.style.setProperty('--border-radius-lg', appearance.borderRadius);
      }

      // Update box shadow
      if (appearance.boxShadow) {
        root.style.setProperty('--shadow-md', appearance.boxShadow);
        root.style.setProperty('--shadow-lg', appearance.boxShadow);
      }
    }
  }, [settings]);

  return settings;
};
