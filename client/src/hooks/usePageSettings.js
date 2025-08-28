import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const usePageSettings = (pageName) => {
  const { data: settings = {} } = useQuery({ 
    queryKey: ['settings'], 
    queryFn: async () => {
      const response = await api.get('/settings');
      return response.data || {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const pageSettings = settings.pages?.[pageName] || {};
  const general = settings.general || {};
  const appearance = settings.appearance || {};
  const seo = settings.seo || {};

  return {
    pageSettings,
    general,
    appearance,
    seo,
    isLoading: false, // You can add loading state if needed
    error: null
  };
};

export default usePageSettings; 