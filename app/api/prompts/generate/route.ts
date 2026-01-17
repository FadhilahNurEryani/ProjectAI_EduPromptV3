import { Prisma } from "@prisma/client"
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { prisma } from "@/lib/db/prisma"
import { generatePrompt, PromptGenerationOptions } from "@/lib/llm/client"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { 
      templateId, 
      variables,
      tone = 'professional',
      outputFormat = 'structured',
      includeExamples = false
    } = body as {
      templateId: string
      variables: Record<string, string>
      tone?: 'professional' | 'casual' | 'academic' | 'creative'
      outputFormat?: 'structured' | 'narrative' | 'bullet-points'
      includeExamples?: boolean
    }

    if (!templateId || !variables) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const template = await prisma.promptTemplate.findUnique({
      where: { id: templateId },
      include: { category: true }
    })

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Generate prompt using improved LLM with options
    const generationOptions: PromptGenerationOptions = {
      tone,
      outputFormat,
      includeExamples,
      temperature: 0.85,
      maxTokens: 2500
    }

    const generatedPrompt = await generatePrompt(
      template.promptTemplate,
      variables,
      generationOptions
    )

    // Track usage
    await prisma.usageAnalytics.create({
      data: {
        userId: user.id,
        templateId: template.id,
        action: "generate",
        metadata: {
          tone,
          outputFormat,
          includeExamples,
          variableCount: Object.keys(variables).length
        }
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

    return NextResponse.json({ 
      prompt: generatedPrompt,
      template: {
        id: template.id,
        title: template.title,
        category: template.category.name
      },
      generationOptions: {
        tone,
        outputFormat,
        includeExamples
      }
    })
  } catch (error) {
    console.error("Error generating prompt:", error)
    return NextResponse.json(
      { error: "Failed to generate prompt" },
      { status: 500 }
    )
  }
}

