import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from './auth/react-auth0-wrapper'
import config from './auth/auth_config.json'
import { BrowserRouter as Router } from 'react-router-dom'


//redirects the user to the page they were trying to access prior to logging in
const onRedirectCallback = appState => {
    window.history.replaceState(
        {},
        document.title,
        appState && appState.targetUrl
            ? appState.targetUrl
            : window.location.pathname
    )
}


ReactDOM.render(
    <Router>
        <Auth0Provider
            domain={config.domain}
            client_id={config.clientId}
            audience={config.audience}
            redirect_uri={config.redirect_uri}
            onRedirectCallback={onRedirectCallback}
        >
            <App />
        </Auth0Provider>
    </Router>, 
    document.getElementById('root')
);
    
serviceWorker.unregister();
