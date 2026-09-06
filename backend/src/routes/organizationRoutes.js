const express = require("express");
const router = express.Router();

const { makeUploader } = require("../middleware/upload");
const uploader = makeUploader();

const {
  createOrganizationDetail,
  getAllOrganizationDetails,
  getOrganizationById,
  updateOrganizationDetail,
  deleteOrganizationDetail,
} = require("../controllers/organizationController");

const auth = require("../middleware/auth");
const adminOrSuperUser = require("../middleware/adminOrSuperUser");

// Public Routes (Base path: /api/organization)
router.get("/", getAllOrganizationDetails);
router.get("/:id", getOrganizationById);

// Protected Admin Routes
router.post(
  "/",
  auth,
  adminOrSuperUser,
  uploader.single("logo"),
  createOrganizationDetail
);

router.put(
  "/:id",
  auth,
  adminOrSuperUser,
  uploader.single("logo"),
  updateOrganizationDetail
);

router.delete(
  "/:id",
  auth,
  adminOrSuperUser,
  deleteOrganizationDetail
);

module.exports = router;