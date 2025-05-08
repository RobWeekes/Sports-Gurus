// frontend/src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
// using Provider from Redux to provide the Redux store
import { Provider } from "react-redux";
import configureStore from "./store";
// use this before rendering
import { restoreCSRF, csrfFetch } from "./store/csrf";


// Create a variable to access the store and expose it on the window.
// It should not be exposed in production

const store = configureStore();

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();
  window.csrfFetch = csrfFetch;
  window.store = store;
} // in Vite projects, environment variables are accessed through import.meta.env instead of process.env (used in other webpack-based setups)

// Wrap the rendered App component in Redux"s Provider component, passing store as a prop of the same name to the Provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
