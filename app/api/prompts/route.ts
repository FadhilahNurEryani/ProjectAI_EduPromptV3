import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { prisma } from "@/lib/db/prisma"
import { Prisma } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as {
      templateId?: string
      inputData?: Prisma.InputJsonValue
      generatedPrompt: string
      title?: string
    }

    const { templateId, inputData, generatedPrompt, title } = body

    if (!generatedPrompt) {
      return NextResponse.json(
        { error: "Missing generated prompt" },
        { status: 400 }
      )
    }

    const savedPrompt = await prisma.generatedPrompt.create({
      data: {
        userId: user.id,
        templateId: templateId ?? null,
        inputData: inputData ?? Prisma.JsonNull,
        generatedPrompt,
        title: title ?? "Untitled Prompt",
      },
    })

    return NextResponse.json(savedPrompt, { status: 201 })
  } catch (error) {
    console.error("Error saving prompt:", error)
    return NextResponse.json(
      { error: "Failed to save prompt" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isFavorite = searchParams.get("favorite")
    const isArchived = searchParams.get("archived")

    const where: {
      userId: string
      isFavorite?: boolean
      isArchived?: boolean
    } = {
      userId: user.id,
    }

    if (isFavorite !== null) {
      where.isFavorite = isFavorite === "true"
    }

    if (isArchived !== null) {
      where.isArchived = isArchived === "true"
    }

    const prompts = await prisma.generatedPrompt.findMany({
      where,
      include: {
        template: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(prompts)
  } catch (error) {
    console.error("Error fetching prompts:", error)
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 }
    )
  }
}
