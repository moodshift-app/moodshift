# MoodShift Backend API

This is the Go Fiber backend for the MoodShift application that generates personalized Spotify playlists based on emotional analysis of user text.

## Features

- **Spotify OAuth Integration**: Securely authenticate users with their Spotify accounts
- **Emotional Text Analysis**: Analyze user's text/curhatan using Google Vertex AI Gemini
- **Playlist Generation**: Create customized playlists based on emotional analysis
- **History Tracking**: Keep track of user's playlist generation history
- **RESTful API**: Clean and well-documented API endpoints

## Project Structure

```
backend-fiber/
├── cmd/                   # Application entry point
│   └── main.go
├── config/                # Environment & configuration loader
├── internal/
│   ├── models/            # Data models
│   ├── services/          # Service interfaces and implementations
│   ├── routes/            # API endpoint handlers
│   ├── middleware/        # Auth, logger, error handling
│   └── utils/             # Validators, error responses
├── Dockerfile             # Container configuration
├── .env.example           # Template for environment variables
├── go.mod
└── go.sum
```

## API Endpoints

### Authentication

- `GET /api/v1/auth/spotify` - Initiate Spotify OAuth flow
- `GET /api/v1/auth/callback` - Spotify OAuth callback handler
- `GET /api/v1/auth/me` - Get current user information

### Playlists

- `POST /api/v1/playlists` - Generate a new playlist from text analysis
- `GET /api/v1/playlists` - Get all playlists for the current user
- `GET /api/v1/playlists/:id` - Get a specific playlist by ID

## Getting Started

### Prerequisites

- Go 1.19+
- Spotify Developer API credentials
- Google Cloud Vertex AI API key (for Gemini)

### Environment Setup

1. Copy the example environment file:

   ```
   cp .env.example .env
   ```

2. Update the `.env` file with your Spotify API credentials and Gemini API key

### Running Locally

```bash
# Install dependencies
go mod download

# Run the server
go run cmd/main.go
```

### Docker Deployment

```bash
# Build the Docker image
docker build -t moodshift-backend .

# Run the container
docker run -p 8080:8080 --env-file .env moodshift-backend
```

## Next Steps for Implementation

- Implement service implementations for:
  - Spotify authentication
  - Gemini emotion analysis
  - Playlist generation
- Add database integration for persistent storage
- Implement error logging and monitoring
- Add unit and integration tests

## License

This project is licensed under the MIT License.
