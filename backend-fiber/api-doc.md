# MoodShift API Documentation

This document outlines the API endpoints for the MoodShift application, a service that generates personalized Spotify playlists based on emotional analysis of user text.

## Base URL

```
https://moodshift.fuadfakhruz.id/api/v1
```

## Standard Response Format

All API endpoints return a standardized JSON response with the following structure:

### Success Response

```json
{
  "success": true,
  "data": {
    // Response data varies depending on the endpoint
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

## Authentication

Most endpoints require authentication using a JWT token. The token should be included in the request header:

```
Authorization: Bearer {token}
```

## Health Check

### GET /health

Check if the API is running.

**Response:**

```json
{
  "status": "ok",
  "info": "MoodShift API is running"
}
```

## Authentication Endpoints

### GET /api/v1/auth/spotify

Initiates the Spotify OAuth authentication flow by redirecting to Spotify's authorization page.

**Parameters:** None

**Response:** Redirects to Spotify's authorization page

---

### GET /api/v1/auth/callback

Handles the callback from Spotify after user authorization.

**Query Parameters:**

- `code` (string, required): The authorization code returned by Spotify

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "spotify_id": "spotify_user_id",
      "display_name": "User's Name",
      "email": "user@example.com",
      "profile_image_url": "https://example.com/profile.jpg",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Missing authorization code"
}
```

---

### GET /api/v1/auth/me

Returns the profile information of the currently authenticated user.

**Authentication:** Required

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "spotify_id": "spotify_user_id",
    "display_name": "User's Name",
    "email": "user@example.com",
    "profile_image_url": "https://example.com/profile.jpg",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

**Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "error": "Unauthorized"
}
```

## Playlist Endpoints

### POST /api/v1/playlists

Generates a new playlist based on emotional analysis of the provided text.

**Authentication:** Required

**Request Body:**

```json
{
  "curhatan_text": "Your text to analyze, must be at least 20 characters",
  "playlist_name": "Optional custom name for the playlist"
}
```

**Validation Rules:**

- `curhatan_text`: Required, minimum 20 characters
- `playlist_name`: Optional

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "playlist_id",
    "user_id": "user_id",
    "spotify_id": "spotify_playlist_id",
    "name": "Playlist Name",
    "description": "Playlist description",
    "curhatan_text": "Original text used for analysis",
    "emotional_analysis": {
      "primary_mood": "Happy",
      "secondary_mood": "Energetic",
      "mood_intensity": 0.85,
      "mood_description": "Feeling joy and excitement",
      "keywords": ["happy", "joyful", "excited"],
      "audio_features": {
        "valence": 0.8,
        "energy": 0.7,
        "tempo": 120.0,
        "danceability": 0.75,
        "acousticness": 0.3,
        "instrumentalness": 0.1
      }
    },
    "track_count": 15,
    "image_url": "https://example.com/playlist-cover.jpg",
    "external_url": "https://open.spotify.com/playlist/abc123",
    "created_at": "2023-01-01T00:00:00Z"
  }
}
```

**Error Responses:**

- **400 Bad Request (Invalid Request Body):**

```json
{
  "success": false,
  "error": "CurhatanText is required; CurhatanText must be at least 20 characters long"
}
```

- **500 Internal Server Error:**

```json
{
  "success": false,
  "error": "Error message"
}
```

---

### GET /api/v1/playlists

Returns all playlists created by the current user.

**Authentication:** Required

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "playlist_id_1",
      "user_id": "user_id",
      "spotify_id": "spotify_playlist_id_1",
      "name": "Playlist 1",
      "description": "Description for playlist 1",
      "curhatan_text": "Original text used for analysis",
      "emotional_analysis": {
        "primary_mood": "Happy",
        "secondary_mood": "Energetic",
        "mood_intensity": 0.85,
        "mood_description": "Feeling joy and excitement",
        "keywords": ["happy", "joyful", "excited"],
        "audio_features": {
          "valence": 0.8,
          "energy": 0.7,
          "tempo": 120.0,
          "danceability": 0.75,
          "acousticness": 0.3,
          "instrumentalness": 0.1
        }
      },
      "track_count": 15,
      "image_url": "https://example.com/playlist1-cover.jpg",
      "external_url": "https://open.spotify.com/playlist/abc123",
      "created_at": "2023-01-01T00:00:00Z"
    },
    {
      "id": "playlist_id_2",
      "user_id": "user_id",
      "spotify_id": "spotify_playlist_id_2",
      "name": "Playlist 2",
      "description": "Description for playlist 2",
      "curhatan_text": "Different text used for analysis",
      "emotional_analysis": {
        "primary_mood": "Sad",
        "secondary_mood": "Reflective",
        "mood_intensity": 0.65,
        "mood_description": "Feeling melancholy and thoughtful",
        "keywords": ["sad", "melancholy", "introspective"],
        "audio_features": {
          "valence": 0.3,
          "energy": 0.4,
          "tempo": 80.0,
          "danceability": 0.25,
          "acousticness": 0.7,
          "instrumentalness": 0.15
        }
      },
      "track_count": 12,
      "image_url": "https://example.com/playlist2-cover.jpg",
      "external_url": "https://open.spotify.com/playlist/def456",
      "created_at": "2023-01-02T00:00:00Z"
    }
  ]
}
```

**Error Response (500 Internal Server Error):**

```json
{
  "success": false,
  "error": "Error message"
}
```

---

### GET /api/v1/playlists/:id

Returns details for a specific playlist by ID.

**Authentication:** Required

**Path Parameters:**

- `id` (string, required): The playlist ID

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "playlist_id",
    "user_id": "user_id",
    "spotify_id": "spotify_playlist_id",
    "name": "Playlist Name",
    "description": "Playlist description",
    "curhatan_text": "Original text used for analysis",
    "emotional_analysis": {
      "primary_mood": "Happy",
      "secondary_mood": "Energetic",
      "mood_intensity": 0.85,
      "mood_description": "Feeling joy and excitement",
      "keywords": ["happy", "joyful", "excited"],
      "audio_features": {
        "valence": 0.8,
        "energy": 0.7,
        "tempo": 120.0,
        "danceability": 0.75,
        "acousticness": 0.3,
        "instrumentalness": 0.1
      }
    },
    "track_count": 15,
    "image_url": "https://example.com/playlist-cover.jpg",
    "external_url": "https://open.spotify.com/playlist/abc123",
    "created_at": "2023-01-01T00:00:00Z"
  }
}
```

**Error Responses:**

- **400 Bad Request (Missing ID):**

```json
{
  "success": false,
  "error": "Missing playlist ID"
}
```

- **404 Not Found:**

```json
{
  "success": false,
  "error": "Playlist not found"
}
```

- **500 Internal Server Error:**

```json
{
  "success": false,
  "error": "Error message"
}
```

## Data Models

### User

```json
{
  "id": "string",
  "spotify_id": "string",
  "display_name": "string",
  "email": "string",
  "profile_image_url": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Playlist

```json
{
  "id": "string",
  "user_id": "string",
  "spotify_id": "string",
  "name": "string",
  "description": "string",
  "curhatan_text": "string",
  "emotional_analysis": "EmotionalAnalysis",
  "track_count": "integer",
  "image_url": "string",
  "external_url": "string",
  "created_at": "datetime"
}
```

### EmotionalAnalysis

```json
{
  "primary_mood": "string",
  "secondary_mood": "string",
  "mood_intensity": "float",
  "mood_description": "string",
  "keywords": ["string"],
  "audio_features": "SpotifyAudioFeatures"
}
```

### SpotifyAudioFeatures

```json
{
  "valence": "float", // Musical positiveness (0.0 to 1.0)
  "energy": "float", // Energy level (0.0 to 1.0)
  "tempo": "float", // Estimated tempo in BPM
  "danceability": "float", // Danceability (0.0 to 1.0)
  "acousticness": "float", // Acousticness (0.0 to 1.0)
  "instrumentalness": "float" // Instrumentalness (0.0 to 1.0)
}
```
