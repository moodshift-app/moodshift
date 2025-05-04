package models

import "time"

// Playlist represents a generated Spotify playlist
type Playlist struct {
	ID              string    `json:"id"`
	UserID          string    `json:"user_id"`
	SpotifyID       string    `json:"spotify_id"`
	Name            string    `json:"name"`
	Description     string    `json:"description,omitempty"`
	CurhatanText    string    `json:"curhatan_text"`
	EmotionalAnalysis *EmotionalAnalysis `json:"emotional_analysis"`
	TrackCount      int       `json:"track_count"`
	ImageURL        string    `json:"image_url,omitempty"`
	ExternalURL     string    `json:"external_url"`
	CreatedAt       time.Time `json:"created_at"`
}