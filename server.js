const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// import controllers
const userController = require("./Controllers/userController");

// import routes
const userRoutes = require("./Routes/userRoutes");

// initialize app
const app = express();

// set up database connection
const DB_URI = "mongodb://localhost:27017/my-database";
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Error connecting to database", err);
  });

// set up middleware
app.use(bodyParser.json());

// set up routes
app.use("/user", userRoutes);

// 404 not found error handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

// start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
