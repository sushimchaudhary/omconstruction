const { prisma } = require("../config/dbConnect");
const uploadToCloudinary = require("../utils/uploadToCloudinary"); 

// 1. CREATE NEW ORGANIZATION DETAIL (POST)
exports.createOrganizationDetail = async (req, res) => {
  try {
    const {
      company_name,
      tagline,
      address,
      primary_email,
      secondary_email,
      primary_phone,
      secondary_phone,
      pan_vat_number,
      facebook_url,
      twitter_url,
      instagram_url,
      linkedin_url,
      location_map_url,
    } = req.body;

    if (!company_name || !address || !primary_email || !primary_phone) {
      return res.status(400).json({
        response: "Company name, address, primary email, and primary phone are required.",
      });
    }

    let logoUrl = req.body.logo || null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "company_logos");
      logoUrl = uploadResult.secure_url;
    }

    const newOrganization = await prisma.organizationalDetail.create({
      data: {
        company_name,
        logo: logoUrl,
        tagline,
        address,
        primary_email,
        secondary_email,
        primary_phone,
        secondary_phone,
        pan_vat_number,
        facebook_url,
        twitter_url,
        instagram_url,
        linkedin_url,
        location_map_url,
      },
    });

    return res.status(201).json({
      response: "Organization detail created successfully",
      data: newOrganization,
    });
  } catch (err) {
    console.error("CREATE ORGANIZATION ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 2. GET ALL ORGANIZATION DETAILS (GET)
exports.getAllOrganizationDetails = async (req, res) => {
  try {
    const organizations = await prisma.organizationalDetail.findMany({
      orderBy: { created_at: "desc" },
    });

    return res.status(200).json({ data: organizations });
  } catch (err) {
    console.error("GET ALL ORGANIZATIONS ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 3. GET SINGLE ORGANIZATION DETAIL BY ID (GET)
exports.getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await prisma.organizationalDetail.findUnique({
      where: { id },
    });

    if (!organization) {
      return res.status(404).json({ response: "Organization detail not found" });
    }

    return res.status(200).json({ data: organization });
  } catch (err) {
    console.error("GET ORGANIZATION BY ID ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 4. UPDATE ORGANIZATION DETAIL BY ID (PUT)
exports.updateOrganizationDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.organizationalDetail.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ response: "Organization detail not found" });
    }

    let logoUrl = existing.logo;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer, "company_logos");
      logoUrl = uploadResult.secure_url;
    } else if (req.body.logo) {
      logoUrl = req.body.logo;
    }

    const updatedOrganization = await prisma.organizationalDetail.update({
      where: { id },
      data: {
        company_name: req.body.company_name || existing.company_name,
        logo: logoUrl,
        tagline: req.body.tagline !== undefined ? req.body.tagline : existing.tagline,
        address: req.body.address || existing.address,
        primary_email: req.body.primary_email || existing.primary_email,
        secondary_email: req.body.secondary_email !== undefined ? req.body.secondary_email : existing.secondary_email,
        primary_phone: req.body.primary_phone || existing.primary_phone,
        secondary_phone: req.body.secondary_phone !== undefined ? req.body.secondary_phone : existing.secondary_phone,
        pan_vat_number: req.body.pan_vat_number !== undefined ? req.body.pan_vat_number : existing.pan_vat_number,
        facebook_url: req.body.facebook_url !== undefined ? req.body.facebook_url : existing.facebook_url,
        twitter_url: req.body.twitter_url !== undefined ? req.body.twitter_url : existing.twitter_url,
        instagram_url: req.body.instagram_url !== undefined ? req.body.instagram_url : existing.instagram_url,
        linkedin_url: req.body.linkedin_url !== undefined ? req.body.linkedin_url : existing.linkedin_url,
        location_map_url: req.body.location_map_url !== undefined ? req.body.location_map_url : existing.location_map_url,
      },
    });

    return res.status(200).json({
      response: "Organization detail updated successfully",
      data: updatedOrganization,
    });
  } catch (err) {
    console.error("UPDATE ORGANIZATION ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 5. DELETE ORGANIZATION DETAIL BY ID (DELETE)
exports.deleteOrganizationDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.organizationalDetail.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ response: "Organization detail not found" });
    }

    await prisma.organizationalDetail.delete({
      where: { id },
    });

    return res.status(200).json({ response: "Organization detail deleted successfully" });
  } catch (err) {
    console.error("DELETE ORGANIZATION ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};