# Setup Guide - EduPrompt AI

## Langkah-langkah Setup

### 1. Install Node.js dan Dependencies

Pastikan Node.js 20+ sudah terinstall. Kemudian install dependencies:

```bash
npm install
```

### 2. Setup Database PostgreSQL

1. Install PostgreSQL jika belum ada
2. Buat database baru:
```sql
CREATE DATABASE eduprompt;
```

3. Update `DATABASE_URL` di file `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/eduprompt?schema=public"
```

### 3. Setup Environment Variables

Copy file `.env.example` menjadi `.env` dan isi dengan konfigurasi Anda:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/eduprompt?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret-key-here"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# LLM API Configuration
LLM_API_URL="https://api.openai.com/v1/chat/completions"
LLM_API_KEY="your-openai-api-key"
LLM_MODEL="gpt-3.5-turbo"
```

**Cara generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Setup Google OAuth (Optional):**
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih project yang ada
3. Enable Google+ API
4. Buat OAuth 2.0 credentials
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID dan Client Secret ke `.env`

**Setup LLM API:**
- **OpenAI**: Dapatkan API key dari [OpenAI Platform](https://platform.openai.com/)
- **Anthropic Claude**: Ganti `LLM_API_URL` dan `LLM_MODEL` sesuai dokumentasi
- **LLM Lain**: Sesuaikan URL dan format request di `lib/llm/client.ts`

### 4. Setup Database Schema

```bash
# Generate Prisma Client
npm run db:generate

# Push schema ke database (untuk development)
npm run db:push

# Atau gunakan migrations (untuk production)
npm run db:migrate
```

### 5. Seed Database

Jalankan seed untuk menambahkan data awal (kategori dan template sample):

```bash
npm run db:seed
```

### 6. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Troubleshooting

### Error: Prisma Client not generated
```bash
npm run db:generate
```

### Error: Database connection failed
- Pastikan PostgreSQL running
- Check `DATABASE_URL` di `.env`
- Pastikan database sudah dibuat

### Error: NextAuth secret missing
- Generate secret dengan: `openssl rand -base64 32`
- Tambahkan ke `.env` sebagai `NEXTAUTH_SECRET`

### Error: LLM API error
- Pastikan `LLM_API_KEY` sudah diisi
- Check apakah API key valid
- Pastikan `LLM_API_URL` sesuai dengan provider

## Next Steps

1. Buat akun admin pertama melalui register
2. Login dan explore fitur-fitur
3. Generate prompt pertama Anda!
4. Customize template sesuai kebutuhan

## Production Deployment

Untuk production:
1. Set environment variables di platform deployment
2. Run migrations: `npm run db:migrate`
3. Build: `npm run build`
4. Start: `npm start`








