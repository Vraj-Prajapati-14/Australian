import { useThemeSettings } from '../hooks/useThemeSettings';

export const ThemeProvider = ({ children }) => {
  // This will automatically update CSS variables when settings change
  const settings = useThemeSettings();
  
  return children;
};
