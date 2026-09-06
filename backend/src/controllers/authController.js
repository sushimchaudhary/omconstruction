const { prisma } = require("../config/dbConnect");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { hashPassword, comparePassword } = require("../utils/userUtils");

// 1. LOGIN
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ response: "Username and password are required." });
    }

    const cleanUsername = username.trim();
    const user = await prisma.user.findUnique({
      where: { username: cleanUsername },
      include: { teamMember: true }
    });

    if (!user) {
      return res.status(400).json({ response: "User not found" });
    }

    if (!user.is_active) {
      return res.status(403).json({ response: "Account is inactive. Contact admin." });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ response: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        teamMember: user.teamMember || null,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ response: "Internal Server Error" });
  }
};

// 2. FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ detail: "Email is required." });

    const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!user) return res.status(404).json({ detail: "User with this email does not exist." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken, resetPasswordExpire },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${user.id}/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Construction Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
    });

    res.status(200).json({ response: "Reset link sent successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ detail: "Server error." });
  }
};

// 3. RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { userId, token, new_password } = req.body;

    if (!userId || !token || !new_password) {
      return res.status(400).json({ detail: "Missing required parameters." });
    }

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        resetPasswordToken: token,
        resetPasswordExpire: {
          gt: new Date(), // टोकनको समय नसकिएको हुनुपर्छ
        },
      },
    });

    if (!user) {
      return res.status(400).json({ detail: "Invalid token or link has expired." });
    }

    const hashedPassword = await hashPassword(new_password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    });

    res.status(200).json({ response: "Password reset successfully!" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ detail: "Server error." });
  }
};

// 4. CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ detail: "User not found" });

    const isMatch = await comparePassword(old_password, user.password);
    if (!isMatch) return res.status(400).json({ detail: "Incorrect current password" });

    const hashedPassword = await hashPassword(new_password);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ response: "Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ detail: "Server error." });
  }
};

// 5. GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id; // Check both naming conventions

    if (!userId) {
      return res.status(401).json({ response: "Unauthorized: Invalid user payload in token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { teamMember: true },
    });

    if (!user) return res.status(404).json({ response: "User not found" });

    const { password, ...userData } = user;
    res.status(200).json({ data: userData });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err); // Termianl log dekhauna crash reason strict check garne
    res.status(500).json({ response: "Server error", error: err.message });
  }
};