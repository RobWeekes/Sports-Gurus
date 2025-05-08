import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    })
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8000"
    }
  } // proxy object: routes: urls to be redirected
}));

// This proxy will force the frontend server to act like it"s being served from the backend server. So if you do a fetch request in the React frontend like fetch("/api/csrf/restore"), then the GET /api/csrf/restore request will be made to the backend server instead of the frontend server.

// The Express backend server is configured to be CSRF protected and will only accept requests that have the right CSRF secret token in a header, and the right CSRF token value in a cookie.



// To automatically open the app in the browser whenever the server starts,
// add the following key:
// server: {
//   open: true
// }
