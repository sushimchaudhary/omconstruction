const express = require("express");
const router = express.Router();

const {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  toggleReadStatus,
  deleteContactMessage,
} = require("../controllers/contactMessageController");

const auth = require("../middleware/auth");
const adminOrSuperUser = require("../middleware/adminOrSuperUser");

// Public Route (Contact form submisison)
router.post("/", createContactMessage);

// Protected Admin Routes
router.get("/", auth, adminOrSuperUser, getAllContactMessages);
router.get("/:id", auth, adminOrSuperUser, getContactMessageById);
router.patch("/:id/read", auth, adminOrSuperUser, toggleReadStatus);
router.delete("/:id", auth, adminOrSuperUser, deleteContactMessage);

module.exports = router;