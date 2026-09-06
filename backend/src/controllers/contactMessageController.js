const { prisma } = require("../config/dbConnect");

// 1. CREATE CONTACT MESSAGE (POST - Public endpoint for contact form)
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ response: "Name, email, and message are required." });
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    });

    return res.status(201).json({
      response: "Your message has been sent successfully.",
      data: newMessage,
    });
  } catch (err) {
    console.error("CREATE CONTACT MESSAGE ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 2. GET ALL CONTACT MESSAGES (GET - Optional is_read filter)
exports.getAllContactMessages = async (req, res) => {
  try {
    const { is_read } = req.query;
    
    const where = {};
    if (is_read !== undefined) {
      where.is_read = is_read === "true";
    }

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { created_at: "desc" },
    });

    return res.status(200).json({ data: messages });
  } catch (err) {
    console.error("GET CONTACT MESSAGES ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 3. GET SINGLE CONTACT MESSAGE BY ID (GET)
exports.getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(404).json({ response: "Contact message not found" });
    }

    return res.status(200).json({ data: message });
  } catch (err) {
    console.error("GET CONTACT MESSAGE BY ID ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 4. TOGGLE READ STATUS (PATCH - Mark as read / unread)
exports.toggleReadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await prisma.contactMessage.findUnique({ where: { id } });

    if (!message) {
      return res.status(404).json({ response: "Contact message not found" });
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { is_read: !message.is_read },
    });

    return res.status(200).json({
      response: updatedMessage.is_read ? "Marked as read" : "Marked as unread",
      data: updatedMessage,
    });
  } catch (err) {
    console.error("TOGGLE READ STATUS ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};

// 5. DELETE CONTACT MESSAGE BY ID (DELETE)
exports.deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.contactMessage.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ response: "Contact message not found" });
    }

    await prisma.contactMessage.delete({ where: { id } });
    return res.status(200).json({ response: "Contact message deleted successfully" });
  } catch (err) {
    console.error("DELETE CONTACT MESSAGE ERROR:", err);
    return res.status(500).json({ response: "Server error" });
  }
};