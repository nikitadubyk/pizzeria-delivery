import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../app/generated/prisma/client";

const BCRYPT_ROUNDS = 12;

function requireEnv(
  name: "DATABASE_URL" | "SUPER_ADMIN_EMAIL" | "SUPER_ADMIN_PASSWORD",
) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} must be set to seed the super administrator`);
  }

  return value;
}

const databaseUrl = requireEnv("DATABASE_URL");
const email = requireEnv("SUPER_ADMIN_EMAIL").toLowerCase();
const password = requireEnv("SUPER_ADMIN_PASSWORD");
const name = process.env.SUPER_ADMIN_NAME?.trim() || "Super Admin";

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const existingSuperAdmin = await prisma.user.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
      role: "SUPER_ADMIN",
      restaurantId: null,
    },
    select: { id: true },
  });

  const superAdmin = existingSuperAdmin
    ? await prisma.user.update({
        where: { id: existingSuperAdmin.id },
        data: {
          name,
          password: passwordHash,
          phone: null,
          isActive: true,
        },
      })
    : await prisma.user.create({
        data: {
          email,
          name,
          password: passwordHash,
          role: "SUPER_ADMIN",
          restaurantId: null,
          phone: null,
        },
      });

  console.info(`Super administrator ${superAdmin.email} is ready`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
