const express = require("express");
const auth = require("../middleware/auth");
const { login, forgotPassword, changePassword, resetPassword } = require("../controllers/authController");
const router = express.Router();

router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", auth, changePassword);

module.exports = router;
