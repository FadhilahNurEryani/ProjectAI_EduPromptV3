import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "rencana-pembelajaran" },
      update: {},
      create: {
        name: "Rencana Pembelajaran",
        slug: "rencana-pembelajaran",
        description: "Template untuk membuat RPP (Rencana Pelaksanaan Pembelajaran)",
        icon: "📝",
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: "materi-pembelajaran" },
      update: {},
      create: {
        name: "Materi Pembelajaran",
        slug: "materi-pembelajaran",
        description: "Template untuk membuat materi pembelajaran",
        icon: "📚",
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: "penilaian" },
      update: {},
      create: {
        name: "Penilaian",
        slug: "penilaian",
        description: "Template untuk membuat soal dan rubrik penilaian",
        icon: "✅",
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: "asesmen" },
      update: {},
      create: {
        name: "Asesmen",
        slug: "asesmen",
        description: "Template untuk asesmen diagnostik, formatif, dan sumatif",
        icon: "📊",
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: "diferensiasi" },
      update: {},
      create: {
        name: "Diferensiasi",
        slug: "diferensiasi",
        description: "Template untuk pembelajaran berdiferensiasi",
        icon: "🎯",
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: "feedback-refleksi" },
      update: {},
      create: {
        name: "Feedback & Refleksi",
        slug: "feedback-refleksi",
        description: "Template untuk feedback konstruktif dan refleksi",
        icon: "💬",
        sortOrder: 6,
      },
    }),
    prisma.category.upsert({
      where: { slug: "engagement" },
      update: {},
      create: {
        name: "Engagement",
        slug: "engagement",
        description: "Template untuk ice breaking, gamifikasi, dan aktivitas engagement",
        icon: "👥",
        sortOrder: 7,
      },
    }),
    prisma.category.upsert({
      where: { slug: "administratif" },
      update: {},
      create: {
        name: "Administratif",
        slug: "administratif",
        description: "Template untuk surat, laporan, dan dokumentasi",
        icon: "📄",
        sortOrder: 8,
      },
    }),
  ])

  console.log("Categories created:", categories.length)

  // Create Sample Templates
  const rppCategory = categories[0]
  const materiCategory = categories[1]

  // RPP Template
  await prisma.promptTemplate.upsert({
    where: { id: "rpp-kurikulum-merdeka" },
    update: {},
    create: {
      id: "rpp-kurikulum-merdeka",
      categoryId: rppCategory.id,
      title: "RPP Kurikulum Merdeka",
      description: "Buat Rencana Pelaksanaan Pembelajaran sesuai Kurikulum Merdeka",
      promptTemplate: `Buatkan Rencana Pelaksanaan Pembelajaran (RPP) untuk mata pelajaran {subject} 
kelas {grade} dengan topik {topic}. Durasi pembelajaran adalah {duration}. 
Tujuan pembelajaran: {learning_objectives}.

RPP harus mencakup:
1. Identitas Pembelajaran (Satuan Pendidikan, Kelas, Alokasi Waktu)
2. Kompetensi Inti dan Kompetensi Dasar
3. Tujuan Pembelajaran (SMART)
4. Indikator Pencapaian Kompetensi
5. Materi Pembelajaran
6. Metode Pembelajaran (sesuai Kurikulum Merdeka)
7. Kegiatan Pembelajaran:
   - Pendahuluan (10 menit)
   - Inti (70 menit)
   - Penutup (10 menit)
8. Asesmen (Diagnostik, Formatif, Sumatif)
9. Pengayaan dan Remedial
10. Refleksi Guru

Gunakan pendekatan student-centered dan integrasikan pembelajaran berdiferensiasi.`,
      variables: {
        subject: "Mata Pelajaran",
        grade: "Kelas",
        topic: "Topik/Materi",
        duration: "Durasi",
        learning_objectives: "Tujuan Pembelajaran",
      },
      tags: ["rpp", "kurikulum-merdeka", "pembelajaran"],
      difficulty: "intermediate",
      estimatedTime: 15,
      isFeatured: true,
      isActive: true,
    },
  })

  // Materi Pembelajaran Template
  await prisma.promptTemplate.upsert({
    where: { id: "penjelasan-konsep" },
    update: {},
    create: {
      id: "penjelasan-konsep",
      categoryId: materiCategory.id,
      title: "Penjelasan Konsep",
      description: "Jelaskan konsep dengan cara yang mudah dipahami siswa",
      promptTemplate: `Jelaskan konsep {concept} untuk siswa kelas {grade} dengan cara yang 
mudah dipahami. Gunakan {context} sebagai konteks atau analogi.

Penjelasan harus:
1. Dimulai dengan pertanyaan atau situasi yang relatable
2. Menggunakan bahasa yang sesuai dengan usia siswa
3. Menyertakan analogi atau metafora yang konkret
4. Memberikan contoh dari kehidupan sehari-hari
5. Menyertakan aktivitas interaktif sederhana untuk memahami konsep
6. Diakhiri dengan ringkasan poin-poin penting

Buat penjelasan yang engaging dan memotivasi siswa untuk belajar lebih lanjut.`,
      variables: {
        concept: "Konsep",
        grade: "Tingkat Kelas",
        context: "Konteks/Situasi",
      },
      tags: ["materi", "penjelasan", "konsep"],
      difficulty: "beginner",
      estimatedTime: 10,
      isFeatured: true,
      isActive: true,
    },
  })

  console.log("Sample templates created")
  console.log("Seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })






