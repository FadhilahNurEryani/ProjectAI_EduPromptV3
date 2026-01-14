// prompts/route.ts - FIXED VERSION
import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { prisma } from "@/lib/db/prisma"
import { Prisma } from "@prisma/client"
import { z } from "zod"  // Tambahkan validation

// Schema validation
const savePromptSchema = z.object({
  templateId: z.string().optional(),
  inputData: z.record(z.any()).optional().default({}),
  generatedPrompt: z.string().min(1, "Prompt cannot be empty"),
  title: z.string().optional().default("Untitled Prompt"),
})

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = savePromptSchema.parse(body)

    const savedPrompt = await prisma.generatedPrompt.create({
      data: {
        userId: user.id,
        templateId: validatedData.templateId ?? null,
        inputData: validatedData.inputData as Prisma.InputJsonValue,
        generatedPrompt: validatedData.generatedPrompt,
        title: validatedData.title,
      },
    })

    return NextResponse.json(savedPrompt, { status: 201 })
  } catch (error) {
    console.error("Error saving prompt:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: "Failed to save prompt" },
      { status: 500 }
    )
  }
}

// GET method tetap sama...