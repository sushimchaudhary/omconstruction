const { prisma } = require("../config/dbConnect");
const { hashPassword } = require("../utils/userUtils");

// 1. Create User (Worker / Super Admin)
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, phone, role, name, designation, address } = req.body;

    const exists = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (exists) return res.status(400).json({ response: "Username or Email already exists" });

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phone,
        role: role || "worker",
        teamMember: {
          create: {
            name: name || username,
            designation: designation || "Worker",
            phone,
            address,
          },
        },
      },
      include: { teamMember: true },
    });

    const { password: _, ...userData } = newUser;
    res.status(201).json({ response: "User created successfully", data: userData });
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ response: "Server error" });
  }
};

// 2. Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        is_active: true,
        created_at: true,
        teamMember: true,
      },
      orderBy: { created_at: "desc" },
    });
    res.status(200).json({ data: users });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ response: "Server error" });
  }
};

// 3. Update User
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phone, role, password, name, designation, address } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ response: "User not found" });

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (role) updateData.role = role;

    if (password && password.trim() !== "") {
      updateData.password = await hashPassword(password);
    }

    // Update TeamMember details if provided
    if (name || designation || address) {
      updateData.teamMember = {
        upsert: {
          create: { name: name || user.username, designation: designation || "Worker", address, phone },
          update: { name, designation, address, phone },
        },
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: { teamMember: true },
    });

    const { password: _, ...userData } = updatedUser;
    res.status(200).json({ response: "User updated successfully", data: userData });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ response: "Server error" });
  }
};

// 4. Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ response: "User not found" });

    await prisma.user.delete({ where: { id } });
    res.status(200).json({ response: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ response: "Server error" });
  }
};

// 5. Toggle User Active Status (Block / Unblock)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ response: "User not found" });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { is_active: !user.is_active },
    });

    res.status(200).json({
      response: updatedUser.is_active ? "User activated" : "User deactivated",
      is_active: updatedUser.is_active,
    });
  } catch (err) {
    console.error("TOGGLE STATUS ERROR:", err);
    res.status(500).json({ response: "Server error" });
  }
};