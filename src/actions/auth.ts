"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation";

export type RegisterState = { error?: string };

export async function registerUser(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    communeId: formData.get("communeId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Données invalides." };
  }

  const { name, email, password, communeId } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, passwordHash, communeId, role: "CITIZEN" },
  });

  redirect("/login?registered=1");
}
