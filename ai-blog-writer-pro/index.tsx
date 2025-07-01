import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App';

/**
 * Mounts the React application into the WordPress editor DOM.
 * 
 * It creates a dedicated <div> for the app to live in, which prevents
 * WordPress editor updates from accidentally unmounting the React app.
 */
const mountApp = () => {
    // We mount into a div we create and append to the body.
    let appRoot = document.getElementById('ai-blog-writer-pro-root');
    if (!appRoot) {
        appRoot = document.createElement('div');
        appRoot.id = 'ai-blog-writer-pro-root';
        document.body.appendChild(appRoot);
        const root = createRoot(appRoot);
        root.render(<App />);
    }
};

// Listen for the 'load' event, but also handle cases where the editor loads async
// which is common in the WordPress block editor environment.
if (document.readyState === 'complete') {
    mountApp();
} else {
    window.addEventListener('load', mountApp);
}
