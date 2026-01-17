// lib/auth/session.ts
import { getServerSession } from "next-auth";
import { authOptions } from "./config";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return null;
  }
  
  return {
    id: session.user.id || "",
    email: session.user.email || "",
    name: session.user.name || "",
    // role: session.user.role || "user", // HAPUS DULU jika error
  };
}

export async function getSession() {
  return await getServerSession(authOptions);
}

