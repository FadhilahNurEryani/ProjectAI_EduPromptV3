import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db/prisma"
import Link from "next/link"
import { Search, Heart, Star } from "lucide-react"

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string }
}) {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  })

  const where: {
    isActive: boolean
    categoryId?: string
    OR?: Array<{
      title?: { contains: string; mode: "insensitive" }
      description?: { contains: string; mode: "insensitive" }
      tags?: { has: string }
    }>
  } = { isActive: true }
  if (searchParams.category) {
    where.categoryId = searchParams.category
  }
  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
      { tags: { has: searchParams.search } },
    ]
  }

  const templates = await prisma.promptTemplate.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: { usageCount: "desc" },
  })

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Template Library</h1>
          <p className="mt-2 text-gray-600">Jelajahi semua template prompt yang tersedia</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari template..."
              className="pl-10"
              defaultValue={searchParams.search}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <Link href="/library">
              <Button variant={!searchParams.category ? "default" : "outline"}>Semua</Button>
            </Link>
            {categories.map((category) => (
              <Link key={category.id} href={`/library?category=${category.id}`}>
                <Button variant={searchParams.category === category.id ? "default" : "outline"}>
                  {category.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {template.category.name}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{template.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {template.description || "Tidak ada deskripsi"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
                  <span>👤 {template.usageCount} penggunaan</span>
                  <span>❤️ {template.difficulty || "Intermediate"}</span>
                </div>
                <div className="flex gap-2">
                  <Link href={`/generate?template=${template.id}`} className="flex-1">
                    <Button className="w-full">Gunakan</Button>
                  </Link>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {templates.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <p>Tidak ada template yang ditemukan</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

