"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, Copy, Heart, Save, RefreshCw, AlertCircle } from "lucide-react"

interface Template {
  id?: string
  title: string
  description: string
  promptTemplate: string
  variables: Record<string, string> | null
  category?: { name: string }
}

const TONE_OPTIONS = [
  { value: 'professional', label: 'Profesional', description: 'Formal & authoritative' },
  { value: 'casual', label: 'Santai', description: 'Friendly & conversational' },
  { value: 'academic', label: 'Akademis', description: 'Scholarly & research-focused' },
  { value: 'creative', label: 'Kreatif', description: 'Imaginative & engaging' },
]

const FORMAT_OPTIONS = [
  { value: 'structured', label: 'Terstruktur', description: 'Dengan sections & headers' },
  { value: 'narrative', label: 'Narasi', description: 'Alur cerita yang mengalir' },
  { value: 'bullet-points', label: 'Poin-poin', description: 'Daftar bullet point' },
]

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const templateId = searchParams.get("template")
  const customTemplateParam = searchParams.get("custom")

  const [template, setTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [templateLoading, setTemplateLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [tone, setTone] = useState<'professional' | 'casual' | 'academic' | 'creative'>('professional')
  const [outputFormat, setOutputFormat] = useState<'structured' | 'narrative' | 'bullet-points'>('structured')
  const [includeExamples, setIncludeExamples] = useState(false)

  // Load template on mount
  useEffect(() => {
    const loadTemplate = async () => {
      setTemplateLoading(true)
      setError("")

      try {
        if (customTemplateParam) {
          try {
            const decoded = JSON.parse(atob(customTemplateParam))
            setTemplate(decoded)
            initializeFormData(decoded)
          } catch (e) {
            setError("Gagal memuat custom template")
          }
        } else if (templateId) {
          const response = await fetch(`/api/templates/${templateId}`)
          if (!response.ok) {
            setError("Template tidak ditemukan")
            setTemplateLoading(false)
            return
          }
          const data = await response.json()
          setTemplate(data)
          initializeFormData(data)
        } else {
          setError("Tidak ada template yang dipilih")
        }
      } catch (err) {
        console.error("Error loading template:", err)
        setError("Terjadi kesalahan saat memuat template")
      } finally {
        setTemplateLoading(false)
      }
    }

    loadTemplate()
  }, [templateId, customTemplateParam])

  const initializeFormData = (templateData: Template) => {
    const variables = (templateData.variables as Record<string, string>) || {}
    const initialData: Record<string, string> = {}
    Object.keys(variables).forEach((key) => {
      initialData[key] = ""
    })
    setFormData(initialData)
  }

  const handleInputChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value })
  }

  const handleGenerate = async () => {
    if (!template) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/prompts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id || "custom",
          variables: formData,
          tone,
          outputFormat,
          includeExamples,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || "Gagal generate prompt")
        setLoading(false)
        return
      }

      setGeneratedPrompt(data.prompt)
    } catch (err) {
      console.error("Error generating prompt:", err)
      setError("Terjadi kesalahan saat generate prompt")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = async () => {
    if (!generatedPrompt || !template) return

    setLoading(true)

    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id || null,
          inputData: formData,
          generatedPrompt,
          title: `${template.title} - ${new Date().toLocaleDateString()}`,
          tone,
          outputFormat,
          includeExamples,
        }),
      })

      if (response.ok) {
        alert("Prompt berhasil disimpan!")
      } else {
        alert("Gagal menyimpan prompt")
      }
    } catch (err) {
      console.error("Error saving prompt:", err)
      alert("Terjadi kesalahan saat menyimpan")
    } finally {
      setLoading(false)
    }
  }

  if (templateLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
              </div>
              <p className="text-gray-600">Memuat template...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!template) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="mb-4 flex justify-center">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold text-gray-900">
                {error || "Template tidak ditemukan"}
              </h3>
              <p className="mb-6 text-center text-sm text-gray-600">
                Pilih template dari library atau buat custom prompt terlebih dahulu
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push("/dashboard/library")}
                  variant="outline"
                  className="flex-1"
                >
                  Library
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/create-prompt")}
                  className="flex-1"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Buat Custom
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const variables = (template.variables as Record<string, string>) || {}

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{template.title}</h1>
          <p className="mt-2 text-gray-600">{template.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Form & Options */}
          <div className="space-y-6">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Isi Data Pembelajaran</CardTitle>
                <CardDescription>Lengkapi form di bawah untuk generate prompt</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(variables).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{label as string}</Label>
                    {key.toLowerCase().includes("tujuan") || key.toLowerCase().includes("description") ? (
                      <Textarea
                        id={key}
                        value={formData[key] || ""}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder={`Masukkan ${label as string}`}
                        rows={4}
                      />
                    ) : (
                      <Input
                        id={key}
                        value={formData[key] || ""}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        placeholder={`Masukkan ${label as string}`}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tone Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pilih Tone</CardTitle>
                <CardDescription>Gaya bahasa prompt yang diinginkan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {TONE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTone(option.value as any)}
                    className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                      tone === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-600">{option.description}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Format Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Format Output</CardTitle>
                <CardDescription>Bagaimana prompt distruktur</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {FORMAT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setOutputFormat(option.value as any)}
                    className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                      outputFormat === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-600">{option.description}</div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Additional Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Opsi Tambahan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={includeExamples}
                    onChange={(e) => setIncludeExamples(e.target.checked)}
                    className="rounded"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Sertakan Contoh</div>
                    <div className="text-xs text-gray-600">Tambahkan 2-3 contoh praktis</div>
                  </div>
                </label>
              </CardContent>
            </Card>

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 flex gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Generate Prompt"}
            </Button>
          </div>

          {/* Preview */}
          <Card className="lg:sticky lg:top-8 h-fit">
            <CardHeader>
              <CardTitle>Preview Prompt</CardTitle>
              <CardDescription>Prompt yang dihasilkan akan muncul di sini</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="min-h-[400px] rounded-md border bg-gray-50 p-4 overflow-auto">
                {generatedPrompt ? (
                  <div className="text-sm whitespace-pre-wrap text-gray-900 leading-relaxed">
                    {generatedPrompt}
                  </div>
                ) : (
                  <p className="text-center text-gray-400">
                    Isi form dan klik Generate untuk melihat preview
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="flex-1"
                  disabled={!generatedPrompt}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  onClick={handleGenerate}
                  variant="outline"
                  className="flex-1"
                  disabled={loading || !generatedPrompt}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!generatedPrompt || loading}
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" disabled={!generatedPrompt}>
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

