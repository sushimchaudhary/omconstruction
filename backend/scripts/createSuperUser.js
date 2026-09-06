// scripts/createsuperUser.js
const { prisma, connectDB } = require("../src/config/dbConnect");
const { hashPassword } = require("../src/utils/userUtils");

const createSuperUser = async () => {
  try {
    console.log("Starting Super User creation...");
    await connectDB();

    console.log("Checking if Super User exists...");
    const exists = await prisma.user.findFirst({
      where: {
        role: "super_admin",
      },
    });

    if (exists) {
      console.log("Super User already exists!");
      return;
    }

    const hashedPassword = await hashPassword("sushim@123");

    // केवल User Model मा रहेका निश्चित Fields हरू मात्र राखिएको छ
    const superUser = await prisma.user.create({
      data: {
        username: "sushim",
        email: "sushimchaudhary1@gmail.com",
        password: hashedPassword,
        phone: "9809508957",
        role: "super_admin",
        is_active: true,
      },
    });

    console.log("Super User created successfully:");
    console.log({
      id: superUser.id,
      username: superUser.username,
      email: superUser.email,
      phone: superUser.phone,
      role: superUser.role,
      is_active: superUser.is_active,
      created_at: superUser.created_at,
    });
  } catch (error) {
    console.error("ERROR creating super user:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from DB.");
  }
};

createSuperUser();