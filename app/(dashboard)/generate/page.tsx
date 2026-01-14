"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Sparkles, Copy, Heart, Save } from "lucide-react"

interface Template {
  id: string
  title: string
  description: string
  promptTemplate: string
  variables: Record<string, string> | null
  category: { name: string }
}

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")

  const [template, setTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (templateId) {
      fetchTemplate(templateId)
    }
  }, [templateId])

  const fetchTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/templates/${id}`)
      const data = await response.json()
      setTemplate(data)
      // Initialize form data with empty values
      const variables = (data.variables as Record<string, string>) || {}
      const initialData: Record<string, string> = {}
      Object.keys(variables).forEach((key) => {
        initialData[key] = ""
      })
      setFormData(initialData)
    } catch (error) {
      console.error("Error fetching template:", error)
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value })
  }

  const handleGenerate = async () => {
    if (!template) return

    setLoading(true)
    try {
      const response = await fetch("/api/prompts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          variables: formData,
        }),
      })

      const data = await response.json()
      setGeneratedPrompt(data.prompt)
    } catch (error) {
      console.error("Error generating prompt:", error)
      alert("Terjadi kesalahan saat generate prompt")
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

    try {
      await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          inputData: formData,
          generatedPrompt,
          title: `${template.title} - ${new Date().toLocaleDateString()}`,
        }),
      })
      alert("Prompt berhasil disimpan!")
    } catch (error) {
      console.error("Error saving prompt:", error)
      alert("Terjadi kesalahan saat menyimpan")
    }
  }

  if (!template) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">Memuat template...</div>
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
          {/* Form */}
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
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {loading ? "Generating..." : "Generate Prompt"}
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview Prompt</CardTitle>
              <CardDescription>Prompt yang dihasilkan akan muncul di sini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 min-h-[300px] rounded-md border bg-gray-50 p-4">
                {generatedPrompt ? (
                  <p className="whitespace-pre-wrap text-sm">{generatedPrompt}</p>
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
                  onClick={handleSave}
                  variant="outline"
                  disabled={!generatedPrompt}
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

