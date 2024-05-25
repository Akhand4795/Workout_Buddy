require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workoutRoutes");
const userRoutes = require("./routes/user");


// Express Application
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

// Connect to Mongo Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Listen for Request
    app.listen(process.env.PORT, () => {
      console.log("Conneted to DB & Listening on Port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.error(err);
  });
