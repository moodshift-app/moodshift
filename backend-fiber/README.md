# MoodShift Backend (Go Fiber)

Ini adalah aplikasi backend MoodShift yang dibangun dengan Go Fiber.

---

## Fitur Utama

- **Autentikasi Spotify**
  - OAuth flow, token handling, refresh, session JWT
- **Analisis Teks**
  - Endpoint analisis curhatan (Vertex AI Gemini)
  - Mapping emosi ke parameter audio Spotify
- **Manajemen Playlist**
  - Endpoint generate playlist
  - Pencarian lagu & pembuatan playlist ke akun Spotify user
  - Endpoint riwayat playlist
- **Error Handling**
  - Format response error konsisten
  - Middleware error, validasi, dan handling API error/limit/expired

---

## Struktur Direktori

```
backend-fiber/
├── cmd/                   # Entry point aplikasi
│   └── main.go
├── config/                # Loader env & config
├── internal/
│   ├── models/            # Data models
│   ├── services/          # Spotify, Gemini, Auth
│   ├── routes/            # Handler per endpoint
│   ├── middleware/        # Auth, logger, error, cors
│   └── utils/             # Validator, error response
├── Dockerfile
├── go.mod
└── go.sum
```

---

## Integrasi Eksternal

- **Spotify API:** Otentikasi, pencarian lagu, pembuatan playlist (zmb3/spotify atau REST)
- **Vertex AI Gemini:** Analisis emosi & tema (REST client Go)

---

## Endpoints

| Endpoint               | Method | Deskripsi             |
| ---------------------- | ------ | --------------------- |
| /auth/login            | POST   | Mulai OAuth Spotify   |
| /auth/callback         | GET    | Callback OAuth        |
| /auth/refresh          | GET    | Refresh token Spotify |
| /api/analyze           | POST   | Analisis curhatan     |
| /api/playlist/generate | POST   | Generate playlist     |
| /api/playlist/history  | GET    | Riwayat playlist user |
| /health                | GET    | Cek status API        |

---

## Teknologi

- **Go Fiber** (web framework)
- **JWT** (session user)
- **Spotify Go SDK / REST**
- **REST client** (Vertex AI)
- **godotenv** (env loader)
- **go-playground/validator** (validasi input)
- **zap/logrus** (logging)
- **Docker** (container)

---

## Best Practices

- Semua secrets & config dalam `.env`
- Validasi input & error handling konsisten
- Gunakan middleware Fiber untuk keamanan dan logging
- Unit testing pada services & routes
- Gunakan Docker untuk deploy production

---

## Deploy & Testing

- Build binary: `go build -o moodshift`
- Jalankan dengan Docker/Docker Compose
- Tes endpoint dengan Postman/Insomnia
- Monitoring & logging aktif pada production

---
