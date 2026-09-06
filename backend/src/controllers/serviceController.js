const { prisma } = require("../config/dbConnect");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// 1. CREATE SERVICE (POST)
exports.createService = async (req, res) => {
  try {
    const { title, description, icon, is_active } = req.body;

    if (!title || !description) {
      return res.status(400).json({ response: "Title and description are required." });
    }

    let imageUrl = req.body.image || null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "services");
      imageUrl = uploadResult.secure_url;
    }

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        icon: icon || null,
        image: imageUrl,
        is_active: is_active !== undefined ? is_active === "true" || is_active === true : true,
      },
    });

    return res.status(201).json({
      response: "Service created successfully",
      data: newService,
    });
  } catch (err) {
    console.error("CREATE SERVICE ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 2. GET ALL SERVICES (GET)
exports.getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { created_at: "desc" },
    });
    return res.status(200).json({ data: services });
  } catch (err) {
    console.error("GET SERVICES ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 3. GET SINGLE SERVICE BY ID (GET)
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({ response: "Service not found" });
    }

    return res.status(200).json({ data: service });
  } catch (err) {
    console.error("GET SERVICE BY ID ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 4. UPDATE SERVICE BY ID (PUT)
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.service.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ response: "Service not found" });
    }

    let imageUrl = existing.image;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "services");
      imageUrl = uploadResult.secure_url;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title: req.body.title || existing.title,
        description: req.body.description || existing.description,
        icon: req.body.icon !== undefined ? req.body.icon : existing.icon,
        image: imageUrl,
        is_active: req.body.is_active !== undefined ? (req.body.is_active === "true" || req.body.is_active === true) : existing.is_active,
      },
    });

    return res.status(200).json({
      response: "Service updated successfully",
      data: updatedService,
    });
  } catch (err) {
    console.error("UPDATE SERVICE ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 5. TOGGLE ACTIVE STATUS (PATCH)
exports.toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      return res.status(404).json({ response: "Service not found" });
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: { is_active: !service.is_active },
    });

    return res.status(200).json({
      response: updatedService.is_active ? "Service activated" : "Service deactivated",
      is_active: updatedService.is_active,
    });
  } catch (err) {
    console.error("TOGGLE STATUS ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 6. DELETE SERVICE BY ID (DELETE)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.service.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ response: "Service not found" });
    }

    await prisma.service.delete({ where: { id } });
    return res.status(200).json({ response: "Service deleted successfully" });
  } catch (err) {
    console.error("DELETE SERVICE ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};