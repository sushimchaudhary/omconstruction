const express = require("express");
const router = express.Router();

const {
  markAttendance,
  bulkMarkAttendance,
  getAllAttendances,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const auth = require("../middleware/auth");
const superuserOnly = require("../middleware/adminOrSuperUser");

// 🔑 सबै Endpoints Login भएको User ले मात्र चलाउन पाउँछ
router.use(auth);

// 👁️ View Routes (Worker ले आफ्नो मात्र र Superuser ले सबैको हेर्न पाउँछ)
router.get("/", getAllAttendances);
router.get("/:id", getAttendanceById);

// ✏️ Modifying Routes (हाजिर हाल्ने, सच्याउने वा मेटाउने काम Superuser ले मात्र गर्न पाउँछ)
router.post("/", superuserOnly, markAttendance);
router.post("/bulk", superuserOnly, bulkMarkAttendance);
router.put("/:id", superuserOnly, updateAttendance);
router.delete("/:id", superuserOnly, deleteAttendance);

module.exports = router;