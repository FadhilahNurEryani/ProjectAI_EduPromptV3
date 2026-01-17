interface LLMRequest {
  prompt: string
  model?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

interface LLMResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

interface PromptGenerationOptions {
  tone?: 'professional' | 'casual' | 'academic' | 'creative'
  outputFormat?: 'structured' | 'narrative' | 'bullet-points' | 'custom'
  includeExamples?: boolean
  temperature?: number
  maxTokens?: number
}

export async function generateWithLLM(request: LLMRequest): Promise<LLMResponse> {
  const apiUrl = process.env.LLM_API_URL || "https://api.openai.com/v1/chat/completions"
  const apiKey = process.env.LLM_API_KEY
  const model = request.model || process.env.LLM_MODEL || "gpt-4"

  if (!apiKey) {
    throw new Error("LLM_API_KEY is not configured")
  }

  try {
    const messages: Array<{ role: 'system' | 'user'; content: string }> = []
    
    if (request.systemPrompt) {
      messages.push({
        role: "system",
        content: request.systemPrompt,
      })
    }
    
    messages.push({
      role: "user",
      content: request.prompt,
    })

    console.log(`[LLM] Calling ${apiUrl} with model ${model}`)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: request.temperature || 0.8,
        max_tokens: request.maxTokens || 2000,
        top_p: 0.95,
      }),
    })

    console.log(`[LLM] Response status: ${response.status}`)

    if (!response.ok) {
      const error = await response.json()
      const errorMsg = error.error?.message || JSON.stringify(error)
      console.error(`[LLM] API Error: ${errorMsg}`)
      throw new Error(`LLM API Error: ${errorMsg}`)
    }

    const data = await response.json()

    console.log(`[LLM] Successfully generated response`)

    return {
      content: data.choices[0]?.message?.content || "",
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
        : undefined,
    }
  } catch (error) {
    console.error("LLM API Error:", error)
    throw error
  }
}

export async function generatePrompt(
  templateContent: string,
  variables: Record<string, string>,
  options: PromptGenerationOptions = {}
): Promise<string> {
  // Replace variables in template first
  let basePrompt = templateContent
  Object.entries(variables).forEach(([key, value]) => {
    basePrompt = basePrompt.replace(new RegExp(`\\{${key}\\}`, "g"), value)
  })

  // If LLM is not configured, return the template-filled prompt
  if (!process.env.LLM_API_KEY) {
    return basePrompt
  }

  try {
    // Build system prompt for consistent, high-quality output
    const systemPrompt = buildSystemPrompt(options)
    
    // Build user prompt with context and instructions
    const userPrompt = buildUserPrompt(basePrompt, variables, options)
    
    const response = await generateWithLLM({
      prompt: userPrompt,
      systemPrompt,
      temperature: options.temperature || 0.85,
      maxTokens: options.maxTokens || 2500,
    })
    
    return response.content.trim()
  } catch (error) {
    console.error("Failed to enhance prompt with LLM, using template:", error)
    return basePrompt
  }
}

function buildSystemPrompt(options: PromptGenerationOptions): string {
  const tone = options.tone || 'professional'
  const format = options.outputFormat || 'structured'
  
  const toneGuidelines: Record<string, string> = {
    professional: "Use a professional, clear, and authoritative tone.",
    casual: "Use a friendly, conversational, and approachable tone.",
    academic: "Use academic language with proper terminology and scholarly references.",
    creative: "Use creative, imaginative, and engaging language with vivid descriptions.",
  }
  
  const formatGuidelines: Record<string, string> = {
    structured: "Organize the response with clear sections, headers, and logical structure.",
    narrative: "Write in a flowing, narrative style that tells a coherent story.",
    'bullet-points': "Use bullet points and concise statements for easy scanning.",
    custom: "Follow any specific format instructions provided.",
  }
  
  return `You are an expert prompt engineer and educational content creator specializing in creating high-quality, engaging prompts for educational purposes. Your role is to generate detailed, well-researched, and creative prompts that inspire learning and critical thinking.

${toneGuidelines[tone]}
${formatGuidelines[format]}

Guidelines:
- Be comprehensive yet concise
- Provide clear instructions or questions
- Include relevant context and background information when helpful
- If examples are requested, provide 2-3 high-quality examples
- Ensure the output is practical and actionable
- Follow Indonesian educational standards and best practices
- Make the prompt specific and tailored to the user's needs
- Avoid generic or templated responses`
}

function buildUserPrompt(
  basePrompt: string,
  variables: Record<string, string>,
  options: PromptGenerationOptions
): string {
  let userPrompt = `Based on the following template and context, please generate a comprehensive, detailed prompt:\n\n`
  
  userPrompt += `TEMPLATE:\n${basePrompt}\n\n`
  
  if (Object.keys(variables).length > 0) {
    userPrompt += `PROVIDED CONTEXT:\n`
    Object.entries(variables).forEach(([key, value]) => {
      userPrompt += `- ${key}: ${value}\n`
    })
    userPrompt += `\n`
  }
  
  if (options.outputFormat === 'bullet-points') {
    userPrompt += `REQUESTED FORMAT: Please structure the output using bullet points and concise statements.\n`
  } else if (options.outputFormat === 'narrative') {
    userPrompt += `REQUESTED FORMAT: Please write in a flowing narrative style.\n`
  } else {
    userPrompt += `REQUESTED FORMAT: Please structure the output with clear sections and logical organization.\n`
  }
  
  if (options.includeExamples) {
    userPrompt += `\nInclude 2-3 practical examples to illustrate the concepts.\n`
  }
  
  userPrompt += `\nGenerate a prompt that is detailed, engaging, and ready to use. Do not include meta-commentary or explanations about the prompt generation process. Just provide the final prompt directly.`
  
  return userPrompt
}








