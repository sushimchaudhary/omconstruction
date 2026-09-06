const { prisma } = require("../config/dbConnect");

// 1. GET ATTENDANCES (Admin/Superuser ले सबैको, Normal Worker ले आफ्नो मात्र हेर्न पाउने)
exports.getAllAttendances = async (req, res) => {
  try {
    const { user_id, project_id, date, status } = req.query;
    const { id: loggedInUserId, role } = req.user;

    const where = {};

    // 🎯 Worker भएमा आफ्नो मात्र data फिल्टर गर्ने
    if (role !== "superuser" && role !== "admin") {
      where.user_id = loggedInUserId;
    } else if (user_id) {
      // Superuser/Admin ले चाह्यो भने specific user को हेर्न सक्छ
      where.user_id = user_id;
    }

    if (project_id) where.project_id = project_id;
    if (status) where.status = status;
    if (date) where.date = new Date(date);

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        user: { select: { id: true, username: true, email: true } },
        project: { select: { id: true, title: true } },
      },
      orderBy: { date: "desc" },
    });

    return res.status(200).json({ data: attendances });
  } catch (err) {
    console.error("GET ATTENDANCES ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 2. GET SINGLE ATTENDANCE BY ID (Worker ले आफ्नो मात्र हेर्न पाउने सुरक्षा सहित)
exports.getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: loggedInUserId, role } = req.user;

    const attendance = await prisma.attendance.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, email: true } },
        project: { select: { id: true, title: true } },
      },
    });

    if (!attendance) {
      return res.status(404).json({ response: "Attendance record not found" });
    }

    // 🔒 यदि Worker हो र अर्कैको record हेर्न खोज्दै छ भने Access Block गर्ने
    if (role !== "superuser" && role !== "admin" && attendance.user_id !== loggedInUserId) {
      return res.status(403).json({ response: "Access denied. You can only view your own attendance." });
    }

    return res.status(200).json({ data: attendance });
  } catch (err) {
    console.error("GET ATTENDANCE BY ID ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 3. MARK OR UPDATE ATTENDANCE (Superuser Only)
exports.markAttendance = async (req, res) => {
  try {
    const { user_id, project_id, date, status, remarks } = req.body;

    if (!user_id || !date) {
      return res.status(400).json({ response: "User ID and date are required." });
    }

    const attendanceDate = new Date(date);

    const attendance = await prisma.attendance.upsert({
      where: {
        user_id_date: {
          user_id,
          date: attendanceDate,
        },
      },
      update: {
        project_id: project_id || null,
        status: status || "present",
        remarks: remarks || null,
      },
      create: {
        user_id,
        project_id: project_id || null,
        date: attendanceDate,
        status: status || "present",
        remarks: remarks || null,
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
        project: { select: { id: true, title: true } },
      },
    });

    return res.status(200).json({
      response: "Attendance recorded successfully",
      data: attendance,
    });
  } catch (err) {
    console.error("MARK ATTENDANCE ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 4. BULK MARK ATTENDANCE (Superuser Only)
exports.bulkMarkAttendance = async (req, res) => {
  try {
    const { attendances } = req.body;

    if (!Array.isArray(attendances) || attendances.length === 0) {
      return res.status(400).json({ response: "Attendances array is required." });
    }

    const operations = attendances.map((item) =>
      prisma.attendance.upsert({
        where: {
          user_id_date: {
            user_id: item.user_id,
            date: new Date(item.date),
          },
        },
        update: {
          project_id: item.project_id || null,
          status: item.status || "present",
          remarks: item.remarks || null,
        },
        create: {
          user_id: item.user_id,
          project_id: item.project_id || null,
          date: new Date(item.date),
          status: item.status || "present",
          remarks: item.remarks || null,
        },
      })
    );

    const results = await prisma.$transaction(operations);

    return res.status(200).json({
      response: "Bulk attendance recorded successfully",
      count: results.length,
      data: results,
    });
  } catch (err) {
    console.error("BULK ATTENDANCE ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 5. UPDATE ATTENDANCE BY ID (Superuser Only)
exports.updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.attendance.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ response: "Attendance record not found" });
    }

    const updated = await prisma.attendance.update({
      where: { id },
      data: {
        project_id: req.body.project_id !== undefined ? req.body.project_id : existing.project_id,
        status: req.body.status || existing.status,
        remarks: req.body.remarks !== undefined ? req.body.remarks : existing.remarks,
        date: req.body.date ? new Date(req.body.date) : existing.date,
      },
      include: {
        user: { select: { id: true, username: true, email: true } },
        project: { select: { id: true, title: true } },
      },
    });

    return res.status(200).json({
      response: "Attendance updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("UPDATE ATTENDANCE ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 6. DELETE ATTENDANCE BY ID (Superuser Only)
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.attendance.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ response: "Attendance record not found" });
    }

    await prisma.attendance.delete({ where: { id } });
    return res.status(200).json({ response: "Attendance record deleted successfully" });
  } catch (err) {
    console.error("DELETE ATTENDANCE ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};