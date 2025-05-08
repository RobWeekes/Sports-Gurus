// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
// using Provider from Redux to provide the Redux store
import { Provider } from 'react-redux';
import configureStore from './store';


// Create a variable to access the store and expose it on the window.
// It should not be exposed in production

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}

// Wrap the rendered App component in Redux's Provider component, passing store as a prop of the same name to the Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
