import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth/session"
import { FileText, Heart, Folder } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const [promptsCount, favoritesCount, templatesCount] = await Promise.all([
    prisma.generatedPrompt.count({ where: { userId: user.id } }),
    prisma.favorite.count({ where: { userId: user.id } }),
    prisma.promptTemplate.count({ where: { isActive: true } }),
  ])

  const popularTemplates = await prisma.promptTemplate.findMany({
    where: { isActive: true, isFeatured: true },
    take: 3,
    orderBy: { usageCount: "desc" },
    include: { category: true },
  })

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Halo, {user.name?.split(" ")[0]}! 👋
          </h1>
          <p className="mt-2 text-gray-600">Selamat datang kembali di EduPrompt AI</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{promptsCount}</div>
              <p className="text-xs text-muted-foreground">Prompt yang telah dibuat</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favoritesCount}</div>
              <p className="text-xs text-muted-foreground">Template favorit</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templatesCount}</div>
              <p className="text-xs text-muted-foreground">Template tersedia</p>
            </CardContent>
          </Card>
        </div>

        {/* Popular Templates */}
        <div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Template Populer</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {popularTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                      {template.category.name}
                    </span>
                    <span>👤 {template.usageCount}</span>
                  </div>
                  <Link href={`/generate?template=${template.id}`}>
                    <Button className="w-full">Gunakan Template</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}






