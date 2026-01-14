# EduPrompt AI

Platform untuk membuat prompt AI yang efektif untuk kebutuhan pendidikan Indonesia.

## 🚀 Fitur Utama

- **Template Library**: Ratusan template prompt siap pakai
- **Smart Generator**: Generate prompt berkualitas dengan AI
- **Kategori Lengkap**: RPP, Materi, Penilaian, Asesmen, dll
- **User Management**: Sistem autentikasi dengan email/password dan Google OAuth
- **My Prompts**: Kelola dan simpan prompt yang telah dibuat
- **Search & Filter**: Cari template dengan mudah

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **LLM Integration**: OpenAI API / Custom LLM API

## 📋 Prerequisites

- Node.js 20+
- PostgreSQL
- npm atau yarn

## 🔧 Installation

1. Clone repository:
```bash
git clone <repository-url>
cd eduprompt-ai
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

Edit `.env` file dan isi dengan konfigurasi Anda:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/eduprompt?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
LLM_API_URL="https://api.openai.com/v1/chat/completions"
LLM_API_KEY="your-llm-api-key"
LLM_MODEL="gpt-3.5-turbo"
```

4. Setup database:
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

5. Run development server:
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📁 Project Structure

```
eduprompt-ai/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   └── layout.tsx
├── components/
│   ├── ui/                # shadcn/ui components
│   └── layouts/           # Layout components
├── lib/
│   ├── db/                # Prisma client
│   ├── auth/              # Auth utilities
│   └── llm/               # LLM integration
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
└── types/                 # TypeScript types
```

## 🔐 Authentication

Aplikasi menggunakan NextAuth.js dengan dua provider:
- **Credentials**: Email/Password
- **Google OAuth**: Login dengan Google

## 🤖 LLM Integration

Aplikasi terintegrasi dengan LLM API untuk generate prompt. Default menggunakan OpenAI API, tapi bisa dikonfigurasi untuk LLM lain.

Untuk menggunakan LLM API:
1. Dapatkan API key dari provider LLM (OpenAI, Anthropic, dll)
2. Set `LLM_API_KEY` di `.env`
3. Set `LLM_API_URL` sesuai dengan provider
4. Set `LLM_MODEL` sesuai model yang ingin digunakan

## 📊 Database Schema

Aplikasi menggunakan PostgreSQL dengan schema:
- `users`: Data pengguna
- `categories`: Kategori prompt
- `prompt_templates`: Template prompt
- `generated_prompts`: Prompt yang telah dibuat user
- `favorites`: Template favorit user
- `usage_analytics`: Analytics penggunaan
- `feedback`: Feedback dari user

## 🧪 Development

```bash
# Run development server
npm run dev

# Run linting
npm run lint

# Generate Prisma Client
npm run db:generate

# Open Prisma Studio
npm run db:studio
```

## 📝 Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run db:generate`: Generate Prisma Client
- `npm run db:push`: Push schema to database
- `npm run db:migrate`: Run migrations
- `npm run db:seed`: Seed database
- `npm run db:studio`: Open Prisma Studio

## 🚀 Deployment

Untuk panduan lengkap deployment, lihat **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Quick Start Deployment ke Vercel:

1. **Push code ke GitHub**
2. **Import project ke Vercel** (vercel.com)
3. **Setup Environment Variables** di Vercel dashboard
4. **Setup Database** (Vercel Postgres atau Supabase/Neon)
5. **Deploy!** Vercel akan otomatis build dan deploy

### Environment Variables yang Diperlukan:

```env
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key
LLM_API_KEY=your-openai-api-key
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_MODEL=gpt-3.5-turbo
```

**📖 Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk panduan lengkap!**

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.






