import { PrismaClient } from "@prisma/client"

// Debug: Log environment variable status
if (process.env.NODE_ENV === "production") {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error("[Prisma] CRITICAL: DATABASE_URL is not defined in production!")
  } else {
    const masked = dbUrl.substring(0, 30) + "..." // Log first 30 chars only
    console.log(`[Prisma] DATABASE_URL found (masked): ${masked}`)
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma








