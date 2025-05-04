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
