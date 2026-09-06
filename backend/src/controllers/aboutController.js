const { prisma } = require("../config/dbConnect");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// 1. CREATE ABOUT US (POST)
exports.createAbout = async (req, res) => {
  try {
    const { title, description, mission, vision, years_exp } = req.body;

    if (!title || !description) {
      return res.status(400).json({ response: "Title and description are required." });
    }

    let imageUrl = req.body.image || null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "about_us");
      imageUrl = uploadResult.secure_url;
    }

    const newAbout = await prisma.about.create({
      data: {
        title,
        description,
        mission,
        vision,
        image: imageUrl,
        years_exp: years_exp ? parseInt(years_exp, 10) : 0,
      },
    });

    return res.status(201).json({
      response: "About section created successfully",
      data: newAbout,
    });
  } catch (err) {
    console.error("CREATE ABOUT ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 2. GET ALL ABOUT ENTRIES (GET)
exports.getAllAbout = async (req, res) => {
  try {
    const aboutList = await prisma.about.findMany({
      orderBy: { created_at: "desc" },
    });
    return res.status(200).json({ data: aboutList });
  } catch (err) {
    console.error("GET ALL ABOUT ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 3. GET SINGLE ABOUT BY ID (GET)
exports.getAboutById = async (req, res) => {
  try {
    const { id } = req.params;
    const about = await prisma.about.findUnique({
      where: { id },
    });

    if (!about) {
      return res.status(404).json({ response: "About details not found" });
    }

    return res.status(200).json({ data: about });
  } catch (err) {
    console.error("GET ABOUT BY ID ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 4. UPDATE ABOUT BY ID (PUT)
exports.updateAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.about.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ response: "About details not found" });
    }

    let imageUrl = existing.image;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "about_us");
      imageUrl = uploadResult.secure_url;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const updatedAbout = await prisma.about.update({
      where: { id },
      data: {
        title: req.body.title || existing.title,
        description: req.body.description || existing.description,
        mission: req.body.mission !== undefined ? req.body.mission : existing.mission,
        vision: req.body.vision !== undefined ? req.body.vision : existing.vision,
        image: imageUrl,
        years_exp: req.body.years_exp !== undefined ? parseInt(req.body.years_exp, 10) : existing.years_exp,
      },
    });

    return res.status(200).json({
      response: "About section updated successfully",
      data: updatedAbout,
    });
  } catch (err) {
    console.error("UPDATE ABOUT ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 5. DELETE ABOUT BY ID (DELETE)
exports.deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.about.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ response: "About details not found" });
    }

    await prisma.about.delete({ where: { id } });
    return res.status(200).json({ response: "About section deleted successfully" });
  } catch (err) {
    console.error("DELETE ABOUT ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};