const { prisma } = require("../config/dbConnect");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// 1. CREATE TEAM MEMBER (POST)
exports.createTeamMember = async (req, res) => {
  try {
    const { user_id, name, designation, phone, address } = req.body;

    if (!name || !designation) {
      return res.status(400).json({ response: "Name and designation are required." });
    }

    let imageUrl = req.body.image || null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "team_members");
      imageUrl = uploadResult.secure_url;
    }

    const newMember = await prisma.teamMember.create({
      data: {
        user_id: user_id || null,
        name,
        designation,
        phone: phone || null,
        address: address || null,
        image: imageUrl,
      },
      include: { user: true },
    });

    return res.status(201).json({
      response: "Team member created successfully",
      data: newMember,
    });
  } catch (err) {
    console.error("CREATE TEAM MEMBER ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 2. GET ALL TEAM MEMBERS (GET)
exports.getAllTeamMembers = async (req, res) => {
  try {
    const members = await prisma.teamMember.findMany({
      include: {
        user: {
          select: { id: true, username: true, email: true, role: true, is_active: true },
        },
      },
      orderBy: { created_at: "desc" },
    });
    return res.status(200).json({ data: members });
  } catch (err) {
    console.error("GET TEAM MEMBERS ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 3. GET SINGLE TEAM MEMBER BY ID (GET)
exports.getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, username: true, email: true, role: true, is_active: true },
        },
      },
    });

    if (!member) {
      return res.status(404).json({ response: "Team member not found" });
    }

    return res.status(200).json({ data: member });
  } catch (err) {
    console.error("GET TEAM MEMBER BY ID ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 4. UPDATE TEAM MEMBER BY ID (PUT)
exports.updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.teamMember.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ response: "Team member not found" });
    }

    let imageUrl = existing.image;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "team_members");
      imageUrl = uploadResult.secure_url;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        user_id: req.body.user_id !== undefined ? req.body.user_id : existing.user_id,
        name: req.body.name || existing.name,
        designation: req.body.designation || existing.designation,
        phone: req.body.phone !== undefined ? req.body.phone : existing.phone,
        address: req.body.address !== undefined ? req.body.address : existing.address,
        image: imageUrl,
      },
      include: { user: true },
    });

    return res.status(200).json({
      response: "Team member updated successfully",
      data: updatedMember,
    });
  } catch (err) {
    console.error("UPDATE TEAM MEMBER ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 5. DELETE TEAM MEMBER BY ID (DELETE)
exports.deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.teamMember.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ response: "Team member not found" });
    }

    await prisma.teamMember.delete({ where: { id } });
    return res.status(200).json({ response: "Team member deleted successfully" });
  } catch (err) {
    console.error("DELETE TEAM MEMBER ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};