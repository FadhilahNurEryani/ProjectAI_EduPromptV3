interface LLMRequest {
  prompt: string
  model?: string
  temperature?: number
  maxTokens?: number
}

interface LLMResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export async function generateWithLLM(request: LLMRequest): Promise<LLMResponse> {
  const apiUrl = process.env.LLM_API_URL || "https://api.openai.com/v1/chat/completions"
  const apiKey = process.env.LLM_API_KEY
  const model = request.model || process.env.LLM_MODEL || "gpt-3.5-turbo"

  if (!apiKey) {
    throw new Error("LLM_API_KEY is not configured")
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: request.prompt,
          },
        ],
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Failed to generate response")
    }

    const data = await response.json()

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
  template: string,
  variables: Record<string, string>
): Promise<string> {
  // Replace variables in template
  let prompt = template
  Object.entries(variables).forEach(([key, value]) => {
    prompt = prompt.replace(new RegExp(`\\{${key}\\}`, "g"), value)
  })

  // If LLM is configured, enhance the prompt
  if (process.env.LLM_API_KEY) {
    try {
      const enhancedPrompt = `Generate a comprehensive educational prompt based on the following template:\n\n${prompt}\n\nPlease provide a detailed, well-structured response that follows Indonesian educational standards and best practices.`
      const response = await generateWithLLM({
        prompt: enhancedPrompt,
        temperature: 0.7,
        maxTokens: 2000,
      })
      return response.content
    } catch (error) {
      console.error("Failed to enhance prompt with LLM, using template:", error)
      return prompt
    }
  }

  return prompt
}






