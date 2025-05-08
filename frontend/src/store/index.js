import configureStore from './store';
import { restoreCSRF, csrfFetch } from './csrf';

// Export the configureStore function as the default export
export default configureStore;

// Export the CSRF-related functions
export { restoreCSRF, csrfFetch };



// This file serves as a central export point for the Redux store and related utilities.

// NOTE: When importing from /store in other files:

// // To import the configureStore function
// import configureStore from './store';

// // To import both the store and CSRF utilities
// import configureStore, { restoreCSRF, csrfFetch } from './store';
