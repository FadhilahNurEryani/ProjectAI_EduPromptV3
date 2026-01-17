import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/lib/auth/session"
import { Heart, Archive, Copy, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function MyPromptsPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const prompts = await prisma.generatedPrompt.findMany({
    where: { userId: user.id, isArchived: false },
    include: {
      template: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Prompts</h1>
          <p className="mt-2 text-gray-600">Kelola semua prompt yang telah Anda buat</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  {prompt.template && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {prompt.template.category.name}
                    </span>
                  )}
                  {prompt.isFavorite && (
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  )}
                </div>
                <CardTitle className="text-lg">{prompt.title || "Untitled Prompt"}</CardTitle>
                <CardDescription>{formatDate(prompt.createdAt)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                  {prompt.generatedPrompt.substring(0, 150)}...
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {prompts.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <p>Belum ada prompt yang dibuat</p>
            <Button className="mt-4" asChild>
              <a href="/generate">Buat Prompt Sekarang</a>
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}








