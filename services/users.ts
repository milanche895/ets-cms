import { hash } from "bcryptjs";
import { queryDatabase } from "@/lib/database";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/roles";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

export type UserInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export async function getUsers(): Promise<PublicUser[]> {
  const rows = await queryDatabase(() => prisma.user.findMany({ orderBy: { name: "asc" } }));
  if (rows === "down") {
    return [];
  }

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function createUser(input: UserInput): Promise<PublicUser> {
  const passwordHash = await hash(input.password, 12);
  const row = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: input.role,
    },
  });

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function deleteUser(id: string, currentUserId: string): Promise<void> {
  if (id === currentUserId) {
    throw new Error("self");
  }
  await prisma.user.delete({ where: { id } });
}
