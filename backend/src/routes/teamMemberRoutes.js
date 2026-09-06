const express = require("express");
const router = express.Router();

const { makeUploader } = require("../middleware/upload");
const uploader = makeUploader();

const {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamMemberController");

const auth = require("../middleware/auth");
const adminOrSuperUser = require("../middleware/adminOrSuperUser");

// Public Routes
router.get("/", getAllTeamMembers);
router.get("/:id", getTeamMemberById);

// Protected Admin Routes
router.post(
  "/",
  auth,
  adminOrSuperUser,
  uploader.single("image"),
  createTeamMember
);

router.put(
  "/:id",
  auth,
  adminOrSuperUser,
  uploader.single("image"),
  updateTeamMember
);

router.delete(
  "/:id",
  auth,
  adminOrSuperUser,
  deleteTeamMember
);

module.exports = router;