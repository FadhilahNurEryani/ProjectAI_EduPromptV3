"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, Copy, Send } from "lucide-react"

export default function EnhancePromptPage() {
  const router = useRouter()

  const [userInput, setUserInput] = useState("")
  const [context, setContext] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleEnhance = async () => {
    if (!userInput.trim()) {
      setError("Silahkan masukkan prompt yang ingin ditingkatkan")
      return
    }

    setLoading(true)
    setError("")
    setEnhancedPrompt("")

    try {
      console.log("Enhancing prompt with:", { userInput: userInput.trim(), context })

      const response = await fetch("/api/prompts/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: userInput.trim(),
          context: context.trim(),
        }),
      })

      console.log("Response status:", response.status)

      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        const errorMsg = data.error || "Gagal meningkatkan prompt"
        console.error("API Error:", errorMsg)
        setError(errorMsg)
        setLoading(false)
        return
      }

      setEnhancedPrompt(data.enhancedPrompt)
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPrompt = () => {
    if (!enhancedPrompt) return
    navigator.clipboard.writeText(enhancedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUsePrompt = () => {
    if (!enhancedPrompt) return
    // Redirect to generate page with the enhanced prompt
    const encoded = btoa(
      JSON.stringify({
        title: "Enhanced Prompt",
        description: userInput,
        promptTemplate: enhancedPrompt,
        variables: {},
        exampleOutput: "",
        instructions: "Prompt yang ditingkatkan dari input user",
        tags: ["enhanced", "learning"],
        difficulty: "intermediate",
        estimatedTime: 15,
      })
    )
    router.push(`/dashboard/generate?custom=${encoded}`)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="text-yellow-500" />
              Tingkatkan Prompt
            </h1>
            <p className="text-gray-600">
              Ubah prompt sederhana Anda menjadi prompt yang lebih detail dan komprehensif dengan bantuan AI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Input Anda</CardTitle>
                <CardDescription>Masukkan topik yang ingin Anda pelajari</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="userInput">Topik/Deskripsi Pembelajaran</Label>
                  <Textarea
                    id="userInput"
                    placeholder="Contoh: saya ingin belajar pembusukan tumbuhan"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="context">Konteks Tambahan (Opsional)</Label>
                  <Input
                    id="context"
                    placeholder="Contoh: untuk kelas VIII, fokus pada ekosistem"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    className="mt-2"
                  />
                </div>

                {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

                <Button
                  onClick={handleEnhance}
                  disabled={loading || !userInput.trim()}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Sedang ditingkatkan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Tingkatkan Prompt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hasil Peningkatan</CardTitle>
                <CardDescription>Prompt yang sudah ditingkatkan dan diperkaya</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {enhancedPrompt ? (
                  <>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {enhancedPrompt}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopyPrompt}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {copied ? "Tersalin!" : "Salin"}
                      </Button>
                      <Button
                        onClick={handleUsePrompt}
                        variant="default"
                        className="flex-1"
                        size="sm"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Gunakan
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>Hasil akan ditampilkan di sini</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contoh Penggunaan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-semibold text-sm mb-1">Input:</p>
                  <p className="text-sm text-gray-700 mb-3">saya ingin belajar pembusukan tumbuhan</p>

                  <p className="font-semibold text-sm mb-1">Output yang Diharapkan:</p>
                  <p className="text-sm text-gray-600 italic">
                    Sebagai ahli botani dan ekologi tanaman, tolong buatkan saya panduan lengkap tentang proses pembusukan tumbuhan, termasuk faktor yang mempengaruhinya, tahapan-tahapan utama, serta peran mikroorganisme dalam proses ini, agar saya dapat memahami mekanisme alami penguraian tumbuhan secara mendalam.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-semibold text-sm mb-1">Input:</p>
                  <p className="text-sm text-gray-700 mb-3">fotosintesis</p>

                  <p className="font-semibold text-sm mb-1">Output yang Diharapkan:</p>
                  <p className="text-sm text-gray-600 italic">
                    Jelaskan proses fotosintesis secara mendalam, termasuk tahapan reaksi cahaya dan siklus Calvin, peran klorofil, bagaimana energi cahaya dikonversi, faktor-faktor yang mempengaruhi laju fotosintesis...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
