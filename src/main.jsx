import { StrictMode } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
  <Auth0Provider
      domain="dev-aoybn4a26o6s8kng.us.auth0.com"
      clientId="tKh4WOCWEY3Es4AkoOYSRrxpHj84iHTS"
      authorizationParams={{
        redirect_uri: `${window.location.origin}/dashboard`,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);

