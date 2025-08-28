import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App as AntdApp } from 'antd';
import 'antd/dist/reset.css';
import './index.css';
import App from './App.jsx';
import { setAuthToken } from './lib/api';
import { getToken } from './lib/auth';

// Set auth token before rendering
setAuthToken(getToken());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AntdApp>
      <App />
    </AntdApp>
  </StrictMode>,
);
