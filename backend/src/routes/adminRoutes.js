const express = require("express");
const router = express.Router();

const adminOrSuperUser = require("../middleware/adminOrSuperUser");
const auth = require("../middleware/auth");

// Correctly imported controller functions
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  toggleUserStatus,
} = require("../controllers/adminController");

const { getProfile } = require("../controllers/authController");

// Profile Route
router.get("/profile", auth, getProfile);


router.get("/profile", auth, getProfile);          // /api/user/profile

router.get("/", adminOrSuperUser, getUsers);        // /api/user (GET - Fetch All Users)
router.post("/", adminOrSuperUser, createUser);     // /api/user (POST - Create User)
router.put("/:id", adminOrSuperUser, updateUser);    // /api/user/:id (PUT)
router.delete("/:id", adminOrSuperUser, deleteUser); // /api/user/:id (DELETE)
router.patch("/:id/block", adminOrSuperUser, toggleUserStatus); // /api/user/:id/block

module.exports = router;