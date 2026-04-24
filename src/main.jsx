import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// Changed from UserRightsProvider to UserRightsContext
import { UserRightsContext } from './context/UserRightsContext'; 
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserRightsContext>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserRightsContext>
    </AuthProvider>
  </StrictMode>
);