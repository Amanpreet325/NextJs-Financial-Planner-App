import { PrismaClient } from "../lib/generated/prisma"; // adjust path if needed
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  try {
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        password: hashedAdminPassword,
        username: "admin",
        name: "Admin User",
        role: "admin"
      },
    });
    
    console.log("Admin user created/updated:", admin);
    
    // Create test client user
    const clientEmail = "client@example.com";
    const clientPassword = "client123";
    const hashedClientPassword = await bcrypt.hash(clientPassword, 10);
    
    const client = await prisma.user.upsert({
      where: { email: clientEmail },
      update: {},
      create: {
        email: clientEmail,
        password: hashedClientPassword,
        name: "Test Client",
        username: "client",
        role: "client"
      },
    });
    
    console.log("Client user created/updated:", client);
  } catch (error) {
    console.error("Error creating users:", error);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());