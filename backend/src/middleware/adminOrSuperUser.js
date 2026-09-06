const jwt = require("jsonwebtoken");
const { prisma } = require("../config/dbConnect");

// Prisma User Schema मा उपलब्ध Field हरू मात्र छानिएको छ
const userSelectFields = {
  id: true,
  username: true,
  email: true,
  phone: true,
  role: true,
  is_active: true,
  created_at: true,
  updated_at: true,
  teamMember: true, // Team member details चाहिने भएमा
};

const adminOrSuperUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ response: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.userId || decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelectFields,
    });

    if (!user) {
      return res.status(401).json({ response: "User not found" });
    }

    // is_active false भएमा access रोक्न
    if (!user.is_active) {
      return res.status(403).json({ response: "Account is inactive/blocked" });
    }

    // Role Enum चेक (super_admin वा admin)
    const isSuper = user.role === "super_admin";
    const isAdmin = user.role === "admin";

    if (!isSuper && !isAdmin) {
      return res.status(403).json({ response: "Access denied" });
    }

    req.user = {
      ...user,
      super_user: isSuper,
      is_admin: isAdmin,
    };

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ response: "Authentication failed" });
  }
};

module.exports = adminOrSuperUser;