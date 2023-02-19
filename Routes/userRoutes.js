const express = require("express");

// import controllers
const userController = require("../Controllers/userController");

// initialize router
const router = express.Router();

// define routes
router.post("/register", userController.register);
router.post("/login", userController.loginUser);
router.post("/get-data", userController.getUserData);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

// export router
module.exports = router;
