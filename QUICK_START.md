# 🚀 Quick Start Guide - EduPrompt AI

Panduan cepat untuk menjalankan aplikasi EduPrompt AI.

## 📋 Prerequisites (Yang Harus Diinstall Terlebih Dahulu)

1. **Node.js 20+** - Download dari [nodejs.org](https://nodejs.org/)
2. **PostgreSQL** - Download dari [postgresql.org](https://www.postgresql.org/download/)
   - Atau gunakan PostgreSQL di cloud (Supabase, Railway, dll)
3. **Git** (optional) - Untuk version control

## 🔧 Langkah-langkah Setup

### 1. Install Dependencies

Buka terminal/command prompt di folder project dan jalankan:

```bash
npm install
```

Ini akan menginstall semua package yang diperlukan (React, Next.js, Prisma, dll).

### 2. Setup Database PostgreSQL

**Option A: PostgreSQL Lokal**
1. Install PostgreSQL di komputer Anda
2. Buat database baru dengan nama `eduprompt`:
   ```sql
   CREATE DATABASE eduprompt;
   ```

**Option B: PostgreSQL Cloud (Lebih Mudah)**
1. Buat akun di [Supabase](https://supabase.com) atau [Railway](https://railway.app)
2. Buat project baru
3. Copy connection string (DATABASE_URL)

### 3. Setup Environment Variables

1. Copy file `.env.example` menjadi `.env`:
   ```bash
   # Windows
   copy .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   ```

2. Buka file `.env` dan isi dengan konfigurasi Anda:

```env
# Database - Ganti dengan connection string PostgreSQL Anda
DATABASE_URL="postgresql://user:password@localhost:5432/eduprompt?schema=public"

# NextAuth - Generate secret key dengan command di bawah
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-string-here"

# Google OAuth (Optional - bisa dikosongkan dulu)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# LLM API - Ganti dengan API key Anda
LLM_API_URL="https://api.openai.com/v1/chat/completions"
LLM_API_KEY="your-openai-api-key-here"
LLM_MODEL="gpt-3.5-turbo"
```

**Cara Generate NEXTAUTH_SECRET:**
```bash
# Windows PowerShell
- [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((New-Guid).ToString()))

# Linux/Mac/Windows Git Bash
openssl rand -base64 32

# Atau gunakan online: https://generate-secret.vercel.app/32
```

**Cara Dapatkan OpenAI API Key:**
1. Daftar di [platform.openai.com](https://platform.openai.com/)
2. Buat API key di [api-keys page](https://platform.openai.com/api-keys)
3. Copy dan paste ke `LLM_API_KEY` di file `.env`

### 4. Setup Database Schema

Jalankan perintah berikut untuk setup database:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema ke database
npm run db:push

# Atau gunakan migrations (recommended untuk production)
npm run db:migrate
```

### 5. Seed Database (Menambahkan Data Awal)

Jalankan seed untuk menambahkan kategori dan template sample:

```bash
npm run db:seed
```

Ini akan menambahkan:
- 8 kategori prompt (RPP, Materi, Penilaian, dll)
- 2 template sample (RPP Kurikulum Merdeka dan Penjelasan Konsep)

### 6. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:3000**

## ✅ Cek Apakah Semua Berjalan

1. Buka browser dan akses: `http://localhost:3000`
2. Anda akan melihat halaman landing page
3. Klik "Daftar" untuk membuat akun pertama
4. Setelah register, login dan akses dashboard

## 🐛 Troubleshooting

### Error: "Cannot find module"
```bash
# Pastikan sudah install dependencies
npm install
```

### Error: Database Connection Failed
- Pastikan PostgreSQL sudah running
- Check `DATABASE_URL` di file `.env` sudah benar
- Pastikan database `eduprompt` sudah dibuat

### Error: Prisma Client not generated
```bash
npm run db:generate
```

### Error: NEXTAUTH_SECRET missing
- Pastikan sudah generate secret key
- Pastikan sudah ditambahkan ke file `.env`

### Error: LLM API Error
- Pastikan `LLM_API_KEY` sudah diisi di `.env`
- Pastikan API key valid dan ada credit
- Untuk testing, bisa sementara tidak menggunakan LLM (prompt akan return template saja)

## 📝 Perintah Penting

```bash
# Development
npm run dev              # Jalankan development server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema ke database (dev)
npm run db:migrate       # Run migrations (production)
npm run db:seed          # Seed data awal
npm run db:studio        # Buka Prisma Studio (database GUI)

# Build & Production
npm run build            # Build untuk production
npm run start            # Jalankan production server
npm run lint             # Run ESLint
```

## 🎯 Langkah Selanjutnya

1. **Buat Akun Pertama**
   - Buka http://localhost:3000
   - Klik "Daftar" dan buat akun

2. **Explore Fitur**
   - Dashboard - Lihat statistik
   - Library - Browse template yang tersedia
   - Generate - Buat prompt pertama Anda
   - My Prompts - Lihat prompt yang sudah dibuat

3. **Customize (Optional)**
   - Tambahkan template baru via Prisma Studio atau langsung ke database
   - Customize UI sesuai kebutuhan
   - Setup Google OAuth jika ingin

## 💡 Tips

- Gunakan `npm run db:studio` untuk melihat dan mengedit data di database dengan GUI
- Untuk development, gunakan `db:push` (lebih cepat)
- Untuk production, gunakan `db:migrate` (lebih aman)
- Jika tidak punya OpenAI API key, aplikasi tetap bisa jalan tapi prompt generation tidak akan di-enhance dengan LLM

## 📞 Masih Ada Masalah?

1. Pastikan semua prerequisites sudah terinstall
2. Pastikan semua langkah di atas sudah dilakukan dengan benar
3. Check console untuk error messages
4. Pastikan port 3000 tidak digunakan aplikasi lain

Selamat menggunakan EduPrompt AI! 🎉







