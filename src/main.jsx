import { StrictMode } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
const domainId = import.meta.env.VITE_AUTH0_DOMAINID; //remember to put a VITE_ before the name of your env variable or else it breaks
const clientId = import.meta.env.VITE_AUTH0_CLIENTID;

root.render(
  <StrictMode>
  <Auth0Provider
      domain =  {domainId}
      clientId= {clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/dashboard`,
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <App />
    </Auth0Provider>
    {/* <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin + "/dashboard",
      }}
      onRedirectCallback={(appState) => {
        const target = appState?.returnTo || "/dashboard";
        window.history.replaceState({}, document.title, target);
      }}
    >
      <App />
    </Auth0Provider> */}
  </StrictMode>
);

