import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App as AntdApp } from 'antd';
import 'antd/dist/reset.css';
import './styles/design-system.css';
import './styles/animations.css';
import './styles/components.css';
import './styles/admin.css';
import './styles/header-clean.css';
import App from './App.jsx';
import { setAuthToken } from './lib/api';
import { getToken } from './lib/auth';

// Set auth token before rendering
setAuthToken(getToken());

// Add global styles
const globalStyles = `
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #ffffff;
    color: #1a1a1a;
    line-height: 1.6;
  }
  
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  /* Header styles now loaded from header-clean.css */
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
  
  /* Hide scrollbar on mobile devices */
  @media (max-width: 768px) {
    ::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
    
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    
    ::-webkit-scrollbar-thumb {
      background: transparent;
    }
    
    /* For Firefox */
    html {
      scrollbar-width: none;
    }
    
    /* For IE and Edge */
    body {
      -ms-overflow-style: none;
    }
  }
  
  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }
  
  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid #1677ff;
    outline-offset: 2px;
  }
  
  /* Remove focus outline for mouse users */
  *:focus:not(:focus-visible) {
    outline: none;
  }
`;

// Inject global styles
const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AntdApp>
      <App />
    </AntdApp>
  </StrictMode>,
);
