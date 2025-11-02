import { StrictMode } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
// src/main.jsx
const domain  = import.meta.env.VITE_AUTH0_DOMAINID;      // e.g. dev-xxxxx.us.auth0.com
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;  // from Auth0 app

if (!domain || !clientId) {
  console.error("Missing VITE_AUTH0_DOMAIN or VITE_AUTH0_CLIENT_ID");
}

root.render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/dashboard`,
        // audience: import.meta.env.VITE_AUTH0_AUDIENCE, // if you use an API
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);

