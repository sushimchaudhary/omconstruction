const jwt = require("jsonwebtoken");
const { prisma } = require("../config/dbConnect");

const userSelectFields = {
  id: true,
  username: true,
  email: true,
  phone: true,
  role: true,
  is_active: true,
  created_at: true,
  updated_at: true,
  teamMember: true,
};

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ response: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract Raw ID
    const rawUserId = decoded.userId || decoded.id;

    if (!rawUserId) {
      return res.status(401).json({ response: "Invalid token structure" });
    }

    // 🟢 FIX: Prisma Schema ma ID Int (Number) ho bhane Number() parse garnus
    // (Yadi Schema ma UUID/String chha bhane Parse parse darkar pardaina)
    const userId = typeof rawUserId === "string" && !isNaN(rawUserId) 
      ? parseInt(rawUserId, 10) 
      : rawUserId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelectFields,
    });

    if (!user) {
      return res.status(401).json({ response: "User not found" });
    }

    if (!user.is_active) {
      return res.status(403).json({ response: "Account is inactive" });
    }

    const isSuper = user.role === "super_admin";
    const isAdmin = user.role === "admin";

    // 🟢 Extra Safety: req.user.userId match hosh vnera both attach garidine
    req.user = {
      ...user,
      userId: user.id, // AuthController/getProfile requirement match
      super_user: isSuper,
      is_admin: isAdmin,
    };

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ response: "Invalid token" });
  }
};

module.exports = auth;