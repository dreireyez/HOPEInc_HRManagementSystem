import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

// Import the Context Providers
import { AuthProvider } from './context/AuthContext';
import { UserRightsProvider } from './context/UserRightsContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* AuthProvider identifies WHO the user is */}
      <AuthProvider>
        {/* UserRightsProvider identifies WHAT they can do */}
        <UserRightsProvider>
          <App />
        </UserRightsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);