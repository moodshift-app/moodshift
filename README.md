# MoodShift

MoodShift adalah aplikasi web yang menghasilkan playlist Spotify berdasarkan analisis emosi dari curhatan pengguna. Sistem ini terdiri dari dua bagian utama: frontend (Next.js + TypeScript) dan backend (Go Fiber), serta integrasi dengan Spotify API dan Vertex AI Gemini.

---

## Arsitektur & Flow Sistem

1. **Frontend (Next.js)**

   - User login ke Spotify (OAuth)
   - User mengisi curhatan (form input)
   - Frontend mengirim curhatan ke backend untuk analisis emosi
   - Menampilkan hasil analisis emosi/tema dan rekomendasi playlist
   - User dapat generate playlist, melihat hasil, dan riwayat playlist

2. **Backend (Go Fiber)**

   - Menangani proses autentikasi Spotify (OAuth)
   - Analisis teks ke Vertex AI Gemini untuk deteksi emosi/tema
   - Mapping emosi ke parameter audio Spotify
   - Generate playlist sesuai hasil analisis
   - Menyimpan dan mengembalikan riwayat playlist

3. **Integrasi Eksternal**
   - **Spotify API**: Otentikasi, pencarian lagu, pembuatan playlist
   - **Vertex AI Gemini**: Analisis teks emosi & tema

---

## Struktur Proyek

```
/
├── README.md
├── frontend-nextjs/
│   └── README.md
├── backend-fiber/
│   └── README.md
```

---

## API Endpoints (Global)

| Endpoint               | Method | Deskripsi                                    |
| ---------------------- | ------ | -------------------------------------------- |
| /auth/login            | POST   | Inisiasi login OAuth Spotify                 |
| /auth/callback         | GET    | Callback OAuth                               |
| /auth/refresh          | GET    | Refresh token Spotify                        |
| /api/analyze           | POST   | Analisis curhat (Vertex AI Gemini)           |
| /api/playlist/generate | POST   | Generate playlist berdasarkan hasil analisis |
| /api/playlist/history  | GET    | Riwayat playlist user                        |
| /health                | GET    | Cek status API                               |

---

## Emosi ke Parameter Audio Spotify

| Emosi     | Parameter Audio                                                   |
| --------- | ----------------------------------------------------------------- |
| Happy     | min_valence: 0.6, target_valence: 0.8, target_energy: 0.7         |
| Sad       | max_valence: 0.4, target_valence: 0.3, max_energy: 0.5            |
| Angry     | max_valence: 0.4, min_energy: 0.7, target_energy: 0.9             |
| Calm      | target_valence: 0.5, max_energy: 0.4, target_acousticness: 0.8    |
| Anxious   | max_valence: 0.5, min_energy: 0.6, max_acousticness: 0.3          |
| Excited   | min_valence: 0.6, min_energy: 0.7, max_acousticness: 0.2          |
| Nostalgic | target_valence: 0.5, max_energy: 0.6, target_acousticness: 0.5    |
| Romantic  | target_valence: 0.6, target_energy: 0.5, target_acousticness: 0.4 |
| Focused   | target_energy: 0.5, target_acousticness: 0.4, max_valence: 0.5    |

---

## Teknologi Inti

- **Frontend:** Next.js, TypeScript, Tailwind CSS, React Query, Context API
- **Backend:** Go Fiber, JWT, Spotfiy Go SDK, REST client, Validator, Docker
- **AI & Musik:** Vertex AI Gemini, Spotify API

---

## Standar & Best Practices

- **Keamanan:** .env, HTTPS, rate limiting, validasi input, JWT session
- **Kode:** Linting (ESLint, golangci-lint), dokumentasi, testing
- **Deployment:** Docker Compose, env prod, logging & monitoring
- **Performa:** Caching, optimasi query & API, lazy loading, error handling

---

## Dokumentasi Lain

- [Frontend Documentation](./frontend-nextjs/README.md)
- [Backend Documentation](./backend-fiber/README.md)

---

## Deployment Frontend Sederhana

### Opsi 1: Hosting Statis (Vercel/Netlify)

Cara paling sederhana untuk men-deploy frontend Vite React:

1. Buat akun di [Vercel](https://vercel.com) atau [Netlify](https://netlify.com)
2. Hubungkan repository GitHub Anda
3. Konfigurasikan pengaturan build:
   - Build command: `pnpm build`
   - Output directory: `dist`
   - Environment variables: Salin dari `.env` file Anda

Keuntungan:

- Otomatis deploy ketika ada perubahan kode
- Gratis untuk kebanyakan kasus penggunaan
- SSL otomatis
- Global CDN
- Tidak perlu mengurus infrastruktur

### Opsi 2: GitHub Pages dengan GitHub Actions

1. Tambahkan file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: "pnpm"
          cache-dependency-path: "frontend-vite/pnpm-lock.yaml"

      - name: Install dependencies
        working-directory: ./frontend-vite
        run: pnpm install --frozen-lockfile

      - name: Build
        working-directory: ./frontend-vite
        run: pnpm build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend-vite/dist
```

2. Aktifkan GitHub Pages di repository settings Anda
3. Tambahkan file `vite.config.ts` yang diperbarui untuk base path di GitHub Pages

### Opsi 3: Deployment Sederhana dengan Docker (Tanpa SSL)

Untuk lingkungan development atau jika Anda menggunakan reverse proxy:

```Dockerfile
FROM node:22-alpine AS build
WORKDIR /app
RUN npm install -g pnpm
COPY frontend-vite/package.json frontend-vite/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend-vite/ ./
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY frontend-vite/nginx-simple.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Opsi 4: Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Inisialisasi project: `firebase init hosting`
4. Deploy: `firebase deploy --only hosting`

Keuntungan:

- Global CDN
- SSL otomatis
- Mudah di-rollback
- Integrasi dengan otentikasi Firebase jika diperlukan

### Opsi 5: AWS Amplify

Sambungkan repository GitHub Anda ke AWS Amplify untuk mendapatkan CI/CD otomatis dengan SSL dan global CDN.
