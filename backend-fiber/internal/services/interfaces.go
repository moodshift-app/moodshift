package services

import (
	"github.com/moodshift-app/backend/internal/models"
)

// AuthService defines the interface for authentication operations
type AuthService interface {
	GetAuthURL() string
	HandleCallback(code string) (*models.User, string, error)
	RefreshAccessToken(user *models.User) error
}

// EmotionService defines the interface for emotion analysis operations
type EmotionService interface {
	AnalyzeText(text string) (*models.EmotionalAnalysis, error)
}

// PlaylistService defines the interface for playlist operations
type PlaylistService interface {
	GeneratePlaylist(userID string, curhatanText string, emotionalAnalysis *models.EmotionalAnalysis, playlistName string) (*models.Playlist, error)
	GetUserPlaylists(userID string) ([]models.Playlist, error)
	GetPlaylistByID(playlistID string) (*models.Playlist, error)
}

// UserService defines the interface for user operations
type UserService interface {
	GetUserByID(id string) (*models.User, error)
	SaveUser(user *models.User) error
}