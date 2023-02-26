// Dependencies
import express from "express";
import mongoose from "mongoose";
// import bodyParser from "body-parser";
import logger from "morgan";
// import error from "http-errors";
import url from "url";
import cors from 'cors';

// Database connection
import connectDB from "./bin/database.js";

// Environment variables
import env from "./env/env.js";
import * as dotenv from "dotenv";
dotenv.config();

// Router imports
import posts from "./routes/post.js";
import users from "./routes/users.js";

// Create express app
const app = express();

// Middlewares
// JSON parser
app.use(express.json());

// Logger
app.use(logger("dev"));

// Dinamic URLs for public files
app.use(express.static(env.public.pathname));

// Cors -> Allow connection with external server
app.use(cors());

// Connect to MongoDB
// Mongoose deprecation warning fix
// mongoose.set("strictQuery", false);
// mongoose
//   .connect(process.env.DB_URI, {
//     useNewUrlParser: true,
//   })
//   .then(() => console.log("MongoDB connected to mmh DB"))
//   .catch((err) => console.log(err));
connectDB();

// Main route
app.get("/", (req, res) => {
  res.send("This is the main route");
});

// Test endpoint
app.get("/test", (req, resp) => {
  resp.send("Test route");
});

// Routes
// Posts endpoint
app.use("/posts", posts);

// Users endpoint
app.use("/users", users);

// 404
app.get('/*', (req,res, next) => {
  res.status(404).json({ message: 'This page doesn\'t exists' });
})

// Export app to server.js
export default app;
