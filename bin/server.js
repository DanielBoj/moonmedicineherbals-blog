#!/user/bin/env node

// Dependencies
import app from "../main.js";
import debug from "debug";
import http from "http";

// Impport starting function
import createAdminUsers from '../public/scripts/createAdminUsers.js';

// Server functions
// Normalizer port function
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  } else {
    if (port >= 0) {
      return port;
    } else {
      return false;
    }
  }
};

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
};

// Handle on HTTP error events
// Events handlers
const onListening = () => {
  const addr = server.address();
  const bind =
    typeof addr === String ? `pipe ${addr.address}` : `port ${addr.port}`;
  debug(`Welcome to the Matrix, Neo! We're running in debug mode on ${bind}!`);

  console.log(`Welcome to the Matrix, Neo! We're listening on ${bind}!`);
};

// Get port from environment and store in Express

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
// Create HTTP server.
const server = http.createServer(app);

// Listen on the port provided by the environment.
server.listen(port);

// On exit listening event
server.on("listening", onListening);

// Create admins users
createAdminUsers();
