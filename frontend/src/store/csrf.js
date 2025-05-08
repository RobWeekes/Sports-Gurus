// frontend/src/store/csrf.js

import Cookies from "js-cookie";

// To make fetch requests with any HTTP verb other than GET, set an XSRF-TOKEN header on the request. The value of the header should be set to the XSRF-TOKEN cookie. To do this, wrap the fetch function on the window that will be used in place of the default fetch function.

export async function csrfFetch(url, options = {}) {
  // if options.method is not set, set it to the GET method
  options.method = options.method || "GET";
  // if options.headers is not set, default it to an empty object
  options.headers = options.headers || {};

  // if the options.method is not "GET", then set the "Content-Type" header to "application/json", and set the "XSRF-TOKEN" header to the value of the "XSRF-TOKEN" cookie
  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json";
    options.headers["XSRF-Token"] = Cookies.get("XSRF-TOKEN");
  }
  // call the default window"s fetch with the url and the options passed in
  const res = await window.fetch(url, options);

  // if the response status code is 400 or above, then throw an error with the error being the response
  if (res.status >= 400) throw res;

  // if the response status code is under 400, then return the response to the next promise chain
  return res;
}


// The GET /api/csrf/restore route needs to be called when the application is loaded. "restoreCSRF" will call the custom csrfFetch function with /api/csrf/restore as the url parameter.

// Call this to get the "XSRF-TOKEN" cookie, only use in development
export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore');
}
