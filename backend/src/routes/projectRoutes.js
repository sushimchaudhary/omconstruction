const express = require("express");
const router = express.Router();

const { makeUploader } = require("../middleware/upload");
const uploader = makeUploader();

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const auth = require("../middleware/auth");
const adminOrSuperUser = require("../middleware/adminOrSuperUser");

// Upload fields configuration (Main 1 image + up to 10 gallery images)
const projectUploads = uploader.fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

// Public Routes
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Protected Admin Routes
router.post(
  "/",
  auth,
  adminOrSuperUser,
  projectUploads,
  createProject
);

router.put(
  "/:id",
  auth,
  adminOrSuperUser,
  projectUploads,
  updateProject
);

router.delete(
  "/:id",
  auth,
  adminOrSuperUser,
  deleteProject
);

module.exports = router;