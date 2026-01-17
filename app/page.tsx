import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  FileText,
  CheckSquare,
  BarChart3,
  Target,
  MessageSquare,
  Users,
  FileCheck,
} from "lucide-react"

export default function HomePage() {
  const categories = [
    { icon: FileText, title: "RPP", description: "Rencana Pelaksanaan Pembelajaran" },
    { icon: BookOpen, title: "Materi", description: "Materi Pembelajaran" },
    { icon: CheckSquare, title: "Penilaian", description: "Soal dan Rubrik" },
    { icon: BarChart3, title: "Asesmen", description: "Asesmen Diagnostik & Formatif" },
    { icon: Target, title: "Diferensiasi", description: "Pembelajaran Diferensiasi" },
    { icon: MessageSquare, title: "Feedback", description: "Feedback & Refleksi" },
    { icon: Users, title: "Engagement", description: "Ice Breaking & Gamifikasi" },
    { icon: FileCheck, title: "Administratif", description: "Surat & Laporan" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900">EduPrompt AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Masuk</Button>
            </Link>
            <Link href="/register">
              <Button>Daftar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">
          Buat Prompt AI untuk Pendidikan
          <br />
          dengan Mudah & Cepat
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          Platform terdepan untuk membuat prompt AI yang efektif untuk kebutuhan pendidikan Anda
        </p>
        <Link href="/register">
          <Button size="lg" className="text-lg px-8 py-6">
            Mulai Sekarang Gratis
          </Button>
        </Link>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Kategori Prompt Tersedia
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Card key={category.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Icon className="mb-2 h-8 w-8 text-primary" />
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            Mengapa EduPrompt AI?
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Template Siap Pakai</CardTitle>
                <CardDescription>
                  Ratusan template prompt yang sudah disesuaikan dengan kurikulum Indonesia
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Generator Cerdas</CardTitle>
                <CardDescription>
                  Generate prompt berkualitas tinggi dengan AI dalam hitungan detik
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mudah Digunakan</CardTitle>
                <CardDescription>
                  Interface yang intuitif, tidak perlu keahlian teknis khusus
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 EduPrompt AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}








