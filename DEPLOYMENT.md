# 🚀 Panduan Deployment - EduPrompt AI

Panduan lengkap untuk mempublikasikan EduPrompt AI agar dapat diakses oleh banyak orang.

## 📋 Prerequisites

Sebelum deploy, pastikan:
- ✅ Project sudah berjalan di local (`npm run dev`)
- ✅ Database sudah setup dan berfungsi
- ✅ Semua environment variables sudah dikonfigurasi
- ✅ Build berhasil (`npm run build`)

## 🎯 Platform Deployment yang Direkomendasikan

### 1. **Vercel** (Recommended untuk Next.js)
Platform terbaik untuk Next.js dengan setup yang mudah dan gratis untuk project kecil.

### 2. **Railway**
Bagus untuk full-stack apps dengan database PostgreSQL terintegrasi.

### 3. **Netlify**
Alternatif yang baik dengan fitur serupa Vercel.

---

## 🌐 Opsi 1: Deploy ke Vercel (Recommended)

### Langkah-langkah:

#### 1. Persiapkan Repository Git

```bash
# Inisialisasi git jika belum ada
git init

# Buat .gitignore (sudah ada)
# Pastikan .env tidak ter-commit

# Commit code
git add .
git commit -m "Initial commit: EduPrompt AI"

# Push ke GitHub/GitLab/Bitbucket
git remote add origin <your-repo-url>
git push -u origin main
```

#### 2. Setup Vercel

1. **Daftar/Login ke Vercel**
   - Kunjungi [vercel.com](https://vercel.com)
   - Login dengan GitHub/GitLab/Bitbucket

2. **Import Project**
   - Klik "Add New Project"
   - Pilih repository Anda
   - Vercel akan auto-detect Next.js

3. **Konfigurasi Build Settings**
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

#### 3. Setup Environment Variables di Vercel

Di halaman project settings → Environment Variables, tambahkan:

```env
# Database (gunakan connection string dari provider database)
DATABASE_URL=postgresql://user:password@host:5432/dbname?schema=public

# NextAuth
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-generated-secret-key-here

# Google OAuth (jika digunakan)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# LLM API
LLM_API_URL=https://api.openai.com/v1/chat/completions
LLM_API_KEY=your-openai-api-key
LLM_MODEL=gpt-3.5-turbo

# Node Environment
NODE_ENV=production
```

**⚠️ Penting:**
- `NEXTAUTH_URL` harus diisi dengan URL Vercel Anda (akan otomatis tersedia setelah deploy pertama)
- Generate `NEXTAUTH_SECRET` dengan: `openssl rand -base64 32`
- Set environment variables untuk **Production**, **Preview**, dan **Development**

#### 4. Setup Database (PostgreSQL)

**Opsi A: Menggunakan Vercel Postgres (Recommended)**
- Di Vercel dashboard → Storage → Create Database → Postgres
- Vercel akan otomatis set `POSTGRES_URL` environment variable
- Update `DATABASE_URL` dengan format: `postgresql://user:pass@host:5432/db?sslmode=require`

**Opsi B: Menggunakan Database Eksternal**
- **Supabase** (Gratis): [supabase.com](https://supabase.com)
- **Neon** (Gratis): [neon.tech](https://neon.tech)
- **Railway** (Gratis): [railway.app](https://railway.app)
- **Render** (Gratis): [render.com](https://render.com)

#### 5. Deploy Database Schema

Setelah database ready, jalankan migration:

**Opsi A: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Set environment variables (jika belum)
vercel env add DATABASE_URL

# Run migration via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
```

**Opsi B: Via Database Provider Console**
- Buka database console (Supabase/Neon/etc)
- Jalankan migration SQL dari Prisma
- Atau gunakan Prisma Studio untuk setup manual

**Opsi C: Setup Script di Vercel**
Tambahkan script di `package.json`:
```json
"scripts": {
  "postinstall": "prisma generate",
  "vercel-build": "prisma generate && prisma migrate deploy && next build"
}
```

#### 6. Seed Database (Optional)

Jika perlu seed data awal, bisa dilakukan via:
- Database console manual
- Atau buat API route khusus untuk seed (hanya untuk development)

#### 7. Deploy!

- Klik "Deploy" di Vercel dashboard
- Atau push ke git, Vercel akan auto-deploy
- Tunggu build selesai (2-5 menit)
- Dapatkan URL: `https://your-app-name.vercel.app`

#### 8. Update Google OAuth Redirect URI

Jika menggunakan Google OAuth:
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Edit OAuth 2.0 credentials
3. Tambahkan Authorized redirect URI:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```

#### 9. Update NEXTAUTH_URL

Setelah deploy pertama, update `NEXTAUTH_URL` di Vercel environment variables dengan URL production Anda.

---

## 🚂 Opsi 2: Deploy ke Railway

### Langkah-langkah:

#### 1. Setup Railway Account
- Kunjungi [railway.app](https://railway.app)
- Login dengan GitHub

#### 2. Create New Project
- Klik "New Project"
- Pilih "Deploy from GitHub repo"
- Pilih repository Anda

#### 3. Setup Database
- Di Railway dashboard → "New" → "Database" → "Add PostgreSQL"
- Railway akan otomatis set `DATABASE_URL` environment variable

#### 4. Setup Environment Variables
Di Railway project settings → Variables, tambahkan semua environment variables seperti di Vercel.

#### 5. Configure Build & Start Commands
Railway akan auto-detect Next.js, tapi pastikan:
- Build Command: `npm run build`
- Start Command: `npm start`

#### 6. Run Migration
Railway menyediakan console, jalankan:
```bash
npx prisma migrate deploy
npx prisma generate
```

#### 7. Deploy
Railway akan otomatis deploy setiap kali push ke GitHub.

---

## 🌍 Opsi 3: Deploy ke Netlify

### Langkah-langkah:

#### 1. Setup Netlify Account
- Kunjungi [netlify.com](https://netlify.com)
- Login dengan GitHub

#### 2. Import Project
- Klik "Add new site" → "Import an existing project"
- Pilih repository

#### 3. Configure Build Settings
- Build command: `npm run build`
- Publish directory: `.next`

**⚠️ Catatan:** Next.js App Router memerlukan Netlify adapter. Install:
```bash
npm install @netlify/plugin-nextjs
```

Buat `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

#### 4. Setup Environment Variables
Di Site settings → Environment variables, tambahkan semua variables.

#### 5. Setup Database
Netlify tidak menyediakan database, gunakan provider eksternal (Supabase, Neon, dll).

---

## 🔧 Setup Database Eksternal (Jika Tidak Menggunakan Vercel Postgres)

### Supabase (Recommended - Gratis)

1. **Daftar di [supabase.com](https://supabase.com)**
2. **Create New Project**
3. **Dapatkan Connection String**
   - Project Settings → Database
   - Copy "Connection string" (URI format)
   - Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
4. **Update DATABASE_URL** di platform deployment
5. **Run Migration**
   - Via Supabase SQL Editor, atau
   - Via local dengan connection string Supabase

### Neon (Gratis)

1. **Daftar di [neon.tech](https://neon.tech)**
2. **Create Project**
3. **Copy Connection String**
4. **Update DATABASE_URL**
5. **Run Migration**

---

## ✅ Checklist Sebelum Deploy

- [ ] Code sudah di-push ke Git repository
- [ ] `.env` tidak ter-commit (cek `.gitignore`)
- [ ] Build berhasil di local (`npm run build`)
- [ ] Database sudah setup dan accessible
- [ ] Environment variables sudah dikonfigurasi
- [ ] Migration sudah dijalankan
- [ ] Google OAuth redirect URI sudah diupdate (jika digunakan)
- [ ] `NEXTAUTH_URL` sudah diisi dengan URL production

---

## 🐛 Troubleshooting

### Error: Database connection failed
- Pastikan `DATABASE_URL` benar
- Pastikan database accessible dari internet (bukan localhost)
- Check firewall/network settings

### Error: Prisma Client not generated
- Tambahkan `prisma generate` di build command
- Atau tambahkan `"postinstall": "prisma generate"` di package.json

### Error: NextAuth secret missing
- Pastikan `NEXTAUTH_SECRET` sudah di-set di environment variables
- Generate secret baru jika perlu

### Error: Build failed
- Check build logs di platform
- Pastikan semua dependencies terinstall
- Pastikan TypeScript tidak ada error

### Error: API routes not working
- Pastikan Next.js API routes di folder `app/api/`
- Check CORS settings jika perlu
- Check environment variables

---

## 🔒 Security Checklist untuk Production

- [ ] `NEXTAUTH_SECRET` menggunakan random string yang kuat
- [ ] `DATABASE_URL` menggunakan SSL connection (`?sslmode=require`)
- [ ] API keys tidak ter-expose di client-side code
- [ ] Rate limiting sudah diimplementasi (jika perlu)
- [ ] HTTPS enabled (otomatis di Vercel/Netlify)
- [ ] Environment variables tidak ter-commit ke Git

---

## 📊 Monitoring & Analytics

Setelah deploy, pertimbangkan untuk setup:
- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Vercel Analytics, Google Analytics
- **Uptime Monitoring**: UptimeRobot, Pingdom

---

## 🎉 Setelah Deploy Berhasil

1. **Test semua fitur utama:**
   - Registration & Login
   - Generate Prompt
   - Template Library
   - My Prompts

2. **Share URL ke user:**
   - URL production: `https://your-app-name.vercel.app`
   - Buat dokumentasi user jika perlu

3. **Monitor performance:**
   - Check Vercel/Railway dashboard
   - Monitor database usage
   - Check error logs

---

## 📝 Catatan Penting

- **Free Tier Limits:**
  - Vercel: 100GB bandwidth/month, unlimited requests
  - Railway: $5 credit/month
  - Supabase: 500MB database, 2GB bandwidth

- **Scaling:**
  - Jika traffic tinggi, pertimbangkan upgrade plan
  - Optimize database queries
  - Implement caching jika perlu

---

## 🆘 Butuh Bantuan?

Jika mengalami masalah saat deploy:
1. Check error logs di platform deployment
2. Check console logs di browser
3. Test di local environment dulu
4. Buat issue di repository dengan detail error

---

**Selamat deploy! 🚀**

