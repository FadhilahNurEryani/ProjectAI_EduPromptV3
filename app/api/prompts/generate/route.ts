import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { prisma } from "@/lib/db/prisma"
import { generatePrompt } from "@/lib/llm/client"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { templateId, variables } = body as {
      templateId: string
      variables: Record<string, string>
    }

    if (!templateId || !variables) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const template = await prisma.promptTemplate.findUnique({
      where: { id: templateId },
    })

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Generate prompt using LLM
    const generatedPrompt = await generatePrompt(template.promptTemplate, variables)

    // Track usage
    await prisma.usageAnalytics.create({
      data: {
        userId: user.id,
        templateId: template.id,
        action: "generate",
      },
    })

    // Update usage count
    await prisma.promptTemplate.update({
      where: { id: template.id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ prompt: generatedPrompt })
  } catch (error) {
    console.error("Error generating prompt:", error)
    return NextResponse.json(
      { error: "Failed to generate prompt" },
      { status: 500 }
    )
  }
}

