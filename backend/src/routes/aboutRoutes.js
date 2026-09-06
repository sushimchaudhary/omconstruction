const express = require("express");
const router = express.Router();

const { makeUploader } = require("../middleware/upload");
const uploader = makeUploader();

const {
  createAbout,
  getAllAbout,
  getAboutById,
  updateAbout,
  deleteAbout,
} = require("../controllers/aboutController");

const auth = require("../middleware/auth");
const adminOrSuperUser = require("../middleware/adminOrSuperUser");

// Public Routes
router.get("/", getAllAbout);
router.get("/:id", getAboutById);

// Protected Admin Routes
router.post(
  "/",
  auth,
  adminOrSuperUser,
  uploader.single("image"),
  createAbout
);

router.put(
  "/:id",
  auth,
  adminOrSuperUser,
  uploader.single("image"),
  updateAbout
);

router.delete(
  "/:id",
  auth,
  adminOrSuperUser,
  deleteAbout
);

module.exports = router;