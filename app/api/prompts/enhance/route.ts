import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth/session"
import { generateWithLLM } from "@/lib/llm/client"

export async function POST(request: Request) {
  try {
    console.log("[API] /prompts/enhance - Starting")

    const user = await getCurrentUser()
    console.log("[API] Current user:", user?.email)

    if (!user) {
      console.log("[API] No authenticated user")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[API] Request body:", body)

    const { userInput, context = "" } = body as {
      userInput: string
      context?: string
    }

    if (!userInput || userInput.trim().length === 0) {
      console.log("[API] No user input provided")
      return NextResponse.json(
        { error: "User input is required" },
        { status: 400 }
      )
    }

    console.log("[API] Building enhancement prompts...")
    const systemPrompt = buildEnhancementSystemPrompt()
    const userPrompt = buildEnhancementPrompt(userInput, context)

    console.log("[API] System Prompt length:", systemPrompt.length)
    console.log("[API] User Prompt length:", userPrompt.length)
    console.log("[API] Calling generateWithLLM...")
    console.log("[API] LLM_MODEL:", process.env.LLM_MODEL)

    try {
      const response = await generateWithLLM({
        prompt: userPrompt,
        systemPrompt,
        temperature: 0.7,
        maxTokens: 1500,
      })

      console.log("[API] LLM Response received, length:", response.content.length)

      const enhancedPrompt = response.content.trim()

      console.log("[API] Enhancement complete, returning success")
      return NextResponse.json({
        success: true,
        enhancedPrompt,
        originalInput: userInput,
        context: context || "general learning",
      })
    } catch (llmError) {
      console.error("[API] LLM Enhancement error:", llmError)
      throw llmError
    }
  } catch (error) {
    console.error("[API] Error enhancing prompt:", error)
    const errorMessage =
      error instanceof Error ? error.message : "Failed to enhance prompt"
    console.error("[API] Error message:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

function buildEnhancementSystemPrompt(): string {
  return `Anda adalah seorang AI yang ahli dalam membuat prompt yang detail, spesifik, dan komprehensif untuk pembelajaran.

Tugas Anda:
1. Terima input singkat dari user tentang apa yang ingin mereka pelajari
2. Transformasikan input tersebut menjadi prompt yang lebih detail dan terstruktur
3. Tambahkan konteks expert, aspek-aspek penting yang perlu dipertimbangkan
4. Buatkan prompt yang mendorong pemahaman mendalam

Gaya Output:
- Dimulai dengan peran/keahlian yang relevan
- Menjelaskan topik dengan detail
- Menyertakan berbagai dimensi/aspek penting
- Menambahkan tujuan pembelajaran yang jelas
- Menggunakan bahasa Indonesia yang profesional namun mudah dipahami

Contoh:
INPUT: "saya ingin belajar fotosintesis"
OUTPUT: "Sebagai guru biologi yang berpengalaman, jelaskan kepada saya proses fotosintesis secara mendalam, termasuk: tahapan-tahapan reaksi cahaya dan siklus Calvin, peran klorofil dan pigmen lain, bagaimana energi cahaya dikonversi menjadi energi kimia, faktor-faktor yang mempengaruhi laju fotosintesis, serta aplikasi pemahaman fotosintesis dalam pertanian modern dan konservasi lingkungan."

Harap berikan prompt yang ditingkatkan langsung tanpa penjelasan tambahan.`
}

function buildEnhancementPrompt(
  userInput: string,
  context: string
): string {
  let prompt = `Tingkatkan dan elaborasi prompt pembelajaran berikut ini menjadi prompt yang lebih detail dan komprehensif:\n\nINPUT USER: "${userInput}"\n\n`

  if (context) {
    prompt += `KONTEKS TAMBAHAN: ${context}\n\n`
  }

  prompt += `Buatkan prompt yang diperbaiki yang:
1. Menambahkan peran expert/ahli yang relevan
2. Menjelaskan topik dengan lebih terstruktur dan detail
3. Mencakup berbagai aspek penting dari topik
4. Mendorong pemahaman yang mendalam dan holistik
5. Menggunakan bahasa yang profesional namun mudah dipahami

Berikan HANYA prompt yang ditingkatkan, tanpa komentar atau penjelasan tambahan.`

  return prompt
}
