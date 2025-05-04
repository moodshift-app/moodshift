package models

import "time"

// User represents a user of the application
type User struct {
	ID                string    `json:"id"`
	SpotifyID         string    `json:"spotify_id"`
	DisplayName       string    `json:"display_name"`
	Email             string    `json:"email"`
	AccessToken       string    `json:"-"` // Sensitive, don't expose in JSON
	RefreshToken      string    `json:"-"` // Sensitive, don't expose in JSON
	TokenExpiresAt    time.Time `json:"-"`
	ProfileImageURL   string    `json:"profile_image_url,omitempty"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}