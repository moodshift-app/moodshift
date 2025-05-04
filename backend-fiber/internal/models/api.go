package models

// APIResponse is the standard response format for all API endpoints
type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// GeneratePlaylistRequest represents the request to generate a new playlist
type GeneratePlaylistRequest struct {
	CurhatanText string `json:"curhatan_text" validate:"required,min=20"`
	PlaylistName string `json:"playlist_name,omitempty"`
}

// LoginResponse contains the JWT token and user information after successful login
type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}