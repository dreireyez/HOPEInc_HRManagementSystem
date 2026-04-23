import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
// Import your providers
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserRightsProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserRightsProvider>
    </AuthProvider>
  </StrictMode>
);