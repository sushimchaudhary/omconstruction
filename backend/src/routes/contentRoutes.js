// NOTE: This route file references several controllers/middleware
// (organizationController, galleryController, sliderController,
// noticeController, staffController, and middleware/authMiddleware's
// `protect`/`editorOnly`/`optionalAuth`) that were not included in the
// pasted reference source. They are NOT part of this package — add them
// back from your original project if you need this route file to run.

const express = require("express");
const router = express.Router();
const { makeUploader } = require("../middleware/upload");
const { protect, editorOnly, optionalAuth } = require("../middleware/authMiddleware");

const organizationCtrl = require("../controllers/organizationController");
const galleryCtrl = require("../controllers/galleryController");
const sliderCtrl = require("../controllers/sliderController");
const noticeCtrl = require("../controllers/noticeController");
const staffController = require("../controllers/staffController");

const uploader = makeUploader();

// --- Organization ---
router
  .route("/organization")
  .get(optionalAuth, organizationCtrl.getAll)
  .post(
    protect,
    editorOnly,
    uploader.single("logo"),
    organizationCtrl.createOne
  );

router
  .route("/organization/:id")
  .get(optionalAuth, organizationCtrl.getOne)
  .put(
    protect,
    editorOnly,
    uploader.single("logo"),
    organizationCtrl.updateOne
  )
  .patch(
    protect,
    editorOnly,
    uploader.single("logo"),
    organizationCtrl.updateOne
  )
  .delete(protect, editorOnly, organizationCtrl.deleteOne);

// --- Gallery ---
router
  .route("/gallery")
  .get(protect, galleryCtrl.getAll)
  .post(
    protect,
    editorOnly,
    uploader.array("images", 10),
    galleryCtrl.createOne
  );

router
  .route("/gallery/:id")
  .get(protect, galleryCtrl.getOne)
  .put(
    protect,
    editorOnly,
    uploader.array("images", 10),
    galleryCtrl.updateOne
  )
  .delete(protect, editorOnly, galleryCtrl.deleteOne);

// --- Staff ---
router
  .route("/staff")
  .get(protect, staffController.getAll)
  .post(
    protect,
    editorOnly,
    uploader.fields([
      { name: "image", maxCount: 1 },
      { name: "accountQrCode", maxCount: 1 },
    ]),
    staffController.createOne
  );

router
  .route("/staff/:id")
  .get(protect, staffController.getOne)
  .put(
    protect,
    editorOnly,
    uploader.fields([
      { name: "image", maxCount: 1 },
      { name: "accountQrCode", maxCount: 1 },
    ]),
    staffController.updateOne
  )
  .patch(
    protect,
    editorOnly,
    uploader.fields([
      { name: "image", maxCount: 1 },
      { name: "accountQrCode", maxCount: 1 },
    ]),
    staffController.updateOne
  )
  .delete(protect, editorOnly, staffController.deleteOne);

// --- Slider Images ---
router
  .route("/sliders")
  .get(protect, sliderCtrl.getAll)
  .post(
    protect,
    editorOnly,
    uploader.array("images", 10),
    sliderCtrl.createOne
  );

router
  .route("/sliders/:id")
  .get(protect, sliderCtrl.getOne)
  .put(
    protect,
    editorOnly,
    uploader.array("images", 10),
    sliderCtrl.updateOne
  )
  .patch(
    protect,
    editorOnly,
    uploader.array("images", 10),
    sliderCtrl.updateOne
  )
  .delete(protect, editorOnly, sliderCtrl.deleteOne);




module.exports = router;
