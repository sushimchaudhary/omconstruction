const express = require("express");
const router = express.Router();

const { makeUploader } = require("../middleware/upload");
const uploader = makeUploader();

const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  toggleServiceStatus,
  deleteService,
} = require("../controllers/serviceController");

const auth = require("../middleware/auth");
const adminOrSuperUser = require("../middleware/adminOrSuperUser");

// Public Routes
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// Protected Admin Routes
router.post(
  "/",
  auth,
  adminOrSuperUser,
  uploader.single("image"),
  createService
);

router.put(
  "/:id",
  auth,
  adminOrSuperUser,
  uploader.single("image"),
  updateService
);

router.patch(
  "/:id/status",
  auth,
  adminOrSuperUser,
  toggleServiceStatus
);

router.delete(
  "/:id",
  auth,
  adminOrSuperUser,
  deleteService
);

module.exports = router;