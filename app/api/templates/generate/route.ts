import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { generateWithLLM } from "@/lib/llm/client"

export async function POST(request: Request) {
  try {
    console.log("[API] /templates/generate - Starting")
    
    const user = await getCurrentUser()
    console.log("[API] Current user:", user?.email)
    
    if (!user) {
      console.log("[API] No authenticated user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[API] Request body:", body)
    
    const { description, subjectArea = '', gradeLevel = '' } = body as {
      description: string
      subjectArea?: string
      gradeLevel?: string
    }

    if (!description || description.trim().length === 0) {
      console.log("[API] No description provided")
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      )
    }

    // Generate template using AI
    console.log("[API] Building prompts...")
    const systemPrompt = buildTemplateGenerationSystemPrompt()
    const userPrompt = buildTemplateGenerationPrompt(
      description,
      subjectArea,
      gradeLevel
    )

    console.log("[API] System Prompt length:", systemPrompt.length)
    console.log("[API] User Prompt length:", userPrompt.length)
    console.log("[API] Calling generateWithLLM...")
    console.log("[API] LLM_API_KEY configured:", !!process.env.LLM_API_KEY)
    console.log("[API] LLM_API_URL:", process.env.LLM_API_URL)
    console.log("[API] LLM_MODEL:", process.env.LLM_MODEL)
    
    try {
      const response = await generateWithLLM({
        prompt: userPrompt,
        systemPrompt,
        temperature: 0.8,
        maxTokens: 3000,
      })

      console.log("[API] LLM Response received, length:", response.content.length)

      // Parse the AI response
      const templateData = parseTemplateResponse(response.content)

      console.log("[API] Template parsed, returning success")
      return NextResponse.json({
        success: true,
        template: templateData,
        rawResponse: response.content.substring(0, 500), // Send first 500 chars for debugging
      })
    } catch (llmError) {
      console.error("[API] LLM Generation error:", llmError)
      throw llmError
    }
  } catch (error) {
    console.error("[API] Error generating template:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to generate template"
    console.error("[API] Error message:", errorMessage)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

function buildTemplateGenerationSystemPrompt(): string {
  return `You are an expert prompt engineer and educational template designer. Your task is to analyze user requirements and generate a well-structured prompt template that can be used to guide AI in generating educational content.

Your output MUST be in the following JSON format (no markdown, just plain JSON):
{
  "title": "Template name",
  "description": "What this template is for",
  "promptTemplate": "The actual template text with variables in {variable_name} format",
  "variables": {
    "variable_name": "Label for this variable",
    "another_variable": "Another label"
  },
  "exampleOutput": "A sample output based on the template",
  "instructions": "Additional instructions for best results",
  "tags": ["tag1", "tag2", "tag3"],
  "difficulty": "beginner|intermediate|advanced",
  "estimatedTime": 15
}

Requirements:
1. The template should be practical and immediately usable
2. Variables should be clearly defined (use 3-6 variables)
3. Include descriptive instructions for best results
4. exampleOutput should demonstrate how the template works
5. Ensure the template supports Indonesian educational standards
6. Make it specific and tailored to the user's needs
7. Response MUST be valid JSON only, no additional text`
}

function buildTemplateGenerationPrompt(
  description: string,
  subjectArea: string,
  gradeLevel: string
): string {
  let prompt = `Generate a prompt template based on the following requirements:\n\n`

  prompt += `User Description/Requirements:\n${description}\n\n`

  if (subjectArea) {
    prompt += `Subject Area: ${subjectArea}\n`
  }

  if (gradeLevel) {
    prompt += `Target Grade Level: ${gradeLevel}\n`
  }

  prompt += `\nCreate a professional, well-structured prompt template that educators can use. The template should:
1. Be clear and specific to the described use case
2. Include 3-6 key variables that users will fill in
3. Have a comprehensive template text that guides AI generation
4. Include practical example output
5. Support Indonesian educational context

Return ONLY valid JSON (no markdown, no code blocks, no explanation).`

  return prompt
}

function parseTemplateResponse(content: string): any {
  try {
    // Try to find JSON in the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        title: parsed.title || "Custom Template",
        description: parsed.description || "",
        promptTemplate: parsed.promptTemplate || "",
        variables: parsed.variables || {},
        exampleOutput: parsed.exampleOutput || "",
        instructions: parsed.instructions || "",
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        difficulty: parsed.difficulty || "intermediate",
        estimatedTime: parsed.estimatedTime || 15,
      }
    }

    // Fallback if JSON parsing fails
    return {
      title: "Custom Template",
      description: "Generated from user description",
      promptTemplate: content,
      variables: {},
      exampleOutput: "",
      instructions: "Use as needed",
      tags: [],
      difficulty: "intermediate",
      estimatedTime: 15,
    }
  } catch (error) {
    console.error("Error parsing template response:", error)
    return {
      title: "Custom Template",
      description: "Generated from user description",
      promptTemplate: content,
      variables: {},
      exampleOutput: "",
      instructions: "Use as needed",
      tags: [],
      difficulty: "intermediate",
      estimatedTime: 15,
    }
  }
}
