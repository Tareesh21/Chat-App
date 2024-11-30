//const express = require('express')
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";

import path from "path";

// to load environment variables from a .env file into your application.
dotenv.config();

const __dirname = path.resolve();

// I have commented below, as i have created one in socket.js
// const app = express()

app.use(express.json());
app.use(cookieParser());

//Handling the request which is sending from the frontend to the backend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//Implementing Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(5000, () => {
  console.log("Server is running on the port");
  connectDB();
});
