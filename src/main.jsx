import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// 1. Import your new Context Providers
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* 2. AuthProvider must come first so UserRights can see the user */}
      <AuthProvider>
        <UserRightsProvider>
          <App />
        </UserRightsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);