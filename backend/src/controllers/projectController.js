const { prisma } = require("../config/dbConnect");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

// 1. CREATE PROJECT (POST)
exports.createProject = async (req, res) => {
  try {
    const { title, description, location, client_name, status, start_date, end_date } = req.body;

    if (!title || !description) {
      return res.status(400).json({ response: "Title and description are required." });
    }

    let singleImageUrl = req.body.image || null;
    let multipleImageUrls = [];

    // Process uploaded files if any
    if (req.files) {
      // Single main image
      if (req.files.image && req.files.image[0]) {
        const uploadResult = await uploadToCloudinary(req.files.image[0].buffer, "projects");
        singleImageUrl = uploadResult.secure_url;
      }

      // Multiple project images
      if (req.files.images && req.files.images.length > 0) {
        const uploadPromises = req.files.images.map((file) =>
          uploadToCloudinary(file.buffer, "projects/gallery")
        );
        const results = await Promise.all(uploadPromises);
        multipleImageUrls = results.map((res) => res.secure_url);
      }
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        location: location || null,
        client_name: client_name || null,
        status: status || "ongoing",
        image: singleImageUrl,
        images: multipleImageUrls,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
      },
    });

    return res.status(201).json({
      response: "Project created successfully",
      data: newProject,
    });
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 2. GET ALL PROJECTS (GET - optional status query support)
exports.getAllProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const projects = await prisma.project.findMany({
      where,
      include: {
        attendances: true,
      },
      orderBy: { created_at: "desc" },
    });

    return res.status(200).json({ data: projects });
  } catch (err) {
    console.error("GET PROJECTS ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 3. GET SINGLE PROJECT BY ID (GET)
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        attendances: true,
      },
    });

    if (!project) {
      return res.status(404).json({ response: "Project not found" });
    }

    return res.status(200).json({ data: project });
  } catch (err) {
    console.error("GET PROJECT BY ID ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 4. UPDATE PROJECT BY ID (PUT)
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.project.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ response: "Project not found" });
    }

    let singleImageUrl = existing.image;
    let multipleImageUrls = existing.images || [];

    if (req.files) {
      // Update single main image if uploaded
      if (req.files.image && req.files.image[0]) {
        const uploadResult = await uploadToCloudinary(req.files.image[0].buffer, "projects");
        singleImageUrl = uploadResult.secure_url;
      }

      // Append or replace gallery images if uploaded
      if (req.files.images && req.files.images.length > 0) {
        const uploadPromises = req.files.images.map((file) =>
          uploadToCloudinary(file.buffer, "projects/gallery")
        );
        const results = await Promise.all(uploadPromises);
        const newUrls = results.map((res) => res.secure_url);
        
        // nयाँ फोटोहरू पुरानो फोटोहरूको पछाडि थप्ने
        multipleImageUrls = [...multipleImageUrls, ...newUrls];
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: req.body.title || existing.title,
        description: req.body.description || existing.description,
        location: req.body.location !== undefined ? req.body.location : existing.location,
        client_name: req.body.client_name !== undefined ? req.body.client_name : existing.client_name,
        status: req.body.status || existing.status,
        image: singleImageUrl,
        images: multipleImageUrls,
        start_date: req.body.start_date ? new Date(req.body.start_date) : existing.start_date,
        end_date: req.body.end_date ? new Date(req.body.end_date) : existing.end_date,
      },
    });

    return res.status(200).json({
      response: "Project updated successfully",
      data: updatedProject,
    });
  } catch (err) {
    console.error("UPDATE PROJECT ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 5. DELETE PROJECT BY ID (DELETE)
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.project.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ response: "Project not found" });
    }

    await prisma.project.delete({ where: { id } });
    return res.status(200).json({ response: "Project deleted successfully" });
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};