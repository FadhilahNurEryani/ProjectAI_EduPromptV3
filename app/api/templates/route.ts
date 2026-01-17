import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"
import type { NextRequest } from 'next/server' // ← IMPORT INI

export async function GET(request: NextRequest) { // ← PAKAI NextRequest
  try {
    // PERBAIKI INI: Gunakan request.nextUrl.searchParams
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured") === "true"

    const where: {
      isActive: boolean
      categoryId?: string
      isFeatured?: boolean
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" }
        description?: { contains: string; mode: "insensitive" }
        tags?: { has: string }
      }>
    } = { isActive: true }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ]
    }

    if (featured) {
      where.isFeatured = true
    }

    const templates = await prisma.promptTemplate.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { usageCount: "desc" },
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}