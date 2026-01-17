"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight, Copy, Save } from "lucide-react"

interface GeneratedTemplate {
  title: string
  description: string
  promptTemplate: string
  variables: Record<string, string>
  exampleOutput: string
  instructions: string
  tags: string[]
  difficulty: string
  estimatedTime: number
}

export default function CreateCustomPromptPage() {
  const router = useRouter()

  const [step, setStep] = useState<"input" | "preview">("input")
  const [description, setDescription] = useState("")
  const [subjectArea, setSubjectArea] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [generatedTemplate, setGeneratedTemplate] = useState<GeneratedTemplate | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerateTemplate = async () => {
    if (!description.trim()) {
      setError("Silahkan masukkan deskripsi prompt yang Anda inginkan")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Generating template with:", { description: description.trim(), subjectArea, gradeLevel })
      
      const response = await fetch("/api/templates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          subjectArea: subjectArea.trim(),
          gradeLevel: gradeLevel.trim(),
        }),
      })

      console.log("Response status:", response.status)
      
      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        const errorMsg = data.error || "Gagal generate template"
        console.error("API Error:", errorMsg)
        setError(errorMsg)
        setLoading(false)
        return
      }

      setGeneratedTemplate(data.template)
      setStep("preview")
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat generate template")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyTemplate = () => {
    if (!generatedTemplate) return
    const text = `Template: ${generatedTemplate.title}\n\n${generatedTemplate.promptTemplate}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveAsTemplate = async () => {
    if (!generatedTemplate) return

    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: generatedTemplate.title,
          description: generatedTemplate.description,
          promptTemplate: generatedTemplate.promptTemplate,
          variables: generatedTemplate.variables,
          exampleOutput: generatedTemplate.exampleOutput,
          tags: generatedTemplate.tags,
          difficulty: generatedTemplate.difficulty,
          estimatedTime: generatedTemplate.estimatedTime,
          isCustom: true,
        }),
      })

      if (response.ok) {
        alert("Template berhasil disimpan!")
        router.push("/dashboard/library")
      } else {
        alert("Gagal menyimpan template")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("Terjadi kesalahan saat menyimpan template")
    }
  }

  const handleUseTemplate = async () => {
    if (!generatedTemplate) return

    sessionStorage.setItem("customTemplate", JSON.stringify(generatedTemplate))
    router.push(
      `/dashboard/generate?custom=${btoa(JSON.stringify(generatedTemplate))}`
    )
  }

  if (step === "preview" && generatedTemplate) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="mb-8">
            <button
              onClick={() => setStep("input")}
              className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Kembali
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {generatedTemplate.title}
            </h1>
            <p className="mt-2 text-gray-600">{generatedTemplate.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Template Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detail Template</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Tingkat Kesulitan</Label>
                    <p className="mt-1 text-sm font-semibold capitalize">
                      {generatedTemplate.difficulty}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Estimasi Waktu</Label>
                    <p className="mt-1 text-sm font-semibold">
                      {generatedTemplate.estimatedTime} menit
                    </p>
                  </div>
                  {generatedTemplate.tags.length > 0 && (
                    <div>
                      <Label className="text-gray-600">Tags</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {generatedTemplate.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Variabel Template</CardTitle>
                  <CardDescription>
                    Variabel yang akan diisi user
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(generatedTemplate.variables).map(
                    ([key, label]) => (
                      <div
                        key={key}
                        className="rounded-lg border border-gray-200 p-3"
                      >
                        <div className="text-xs font-mono text-gray-500">
                          {key}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-gray-900">
                          {label}
                        </div>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>

              {generatedTemplate.instructions && (
                <Card>
                  <CardHeader>
                    <CardTitle>Petunjuk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {generatedTemplate.instructions}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Preview & Actions */}
            <div className="space-y-6">
              <Card className="lg:sticky lg:top-8 h-fit">
                <CardHeader>
                  <CardTitle>Template Prompt</CardTitle>
                  <CardDescription>
                    Ini adalah template yang akan digunakan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="min-h-[300px] rounded-lg border bg-gray-50 p-4 overflow-auto">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900">
                      {generatedTemplate.promptTemplate}
                    </p>
                  </div>

                  {generatedTemplate.exampleOutput && (
                    <div>
                      <Label className="text-gray-600">Contoh Output</Label>
                      <div className="mt-2 rounded-lg border bg-blue-50 p-3">
                        <p className="text-xs whitespace-pre-wrap text-gray-700">
                          {generatedTemplate.exampleOutput}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleCopyTemplate}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      onClick={handleSaveAsTemplate}
                      variant="outline"
                      className="flex-1"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                  </div>

                  <Button
                    onClick={handleUseTemplate}
                    className="w-full"
                    size="lg"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gunakan Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Buat Prompt Custom
          </h1>
          <p className="mt-2 text-gray-600">
            Deskripsikan prompt yang Anda inginkan, dan AI akan membuat template
            untuk Anda
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Jelaskan Prompt Anda</CardTitle>
                <CardDescription>
                  Berikan deskripsi detail tentang prompt yang ingin Anda buat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Deskripsi Prompt *
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contoh: Saya ingin membuat prompt untuk guru menganalisis kemampuan berpikir kritis siswa dengan memberikan pertanyaan Socratic method..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    Jelaskan tujuan, konteks, dan hasil yang diharapkan
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Mata Pelajaran (Opsional)</Label>
                    <Input
                      id="subject"
                      value={subjectArea}
                      onChange={(e) => setSubjectArea(e.target.value)}
                      placeholder="Contoh: Sains, Matematika, Bahasa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Tingkat Kelas (Opsional)</Label>
                    <Input
                      id="grade"
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      placeholder="Contoh: SD, SMP, SMA"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button
                  onClick={handleGenerateTemplate}
                  disabled={loading || !description.trim()}
                  className="w-full"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {loading ? "Generating..." : "Generate Template"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-900">Deskripsi yang Baik</h4>
                  <p className="mt-1 text-gray-600">
                    Sebutkan tujuan, target audiens, dan hasil yang diharapkan
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Spesifik</h4>
                  <p className="mt-1 text-gray-600">
                    Jelaskan konteks dan detail tentang apa yang ingin Anda capai
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Detail</h4>
                  <p className="mt-1 text-gray-600">
                    Semakin detail, semakin baik template yang dihasilkan
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Contoh Deskripsi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="rounded bg-gray-50 p-2 text-gray-700">
                  "Prompt untuk guru membuat pertanyaan diskusi yang merangsang
                  pemikiran kritis siswa kelas 8 tentang isu sosial"
                </div>
                <div className="rounded bg-gray-50 p-2 text-gray-700">
                  "Template untuk membuat rencana pembelajaran yang terstruktur
                  dengan tujuan, metode, dan penilaian yang jelas"
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
