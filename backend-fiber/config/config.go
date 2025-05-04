package config

import (
	"os"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application
type Config struct {
	Port            string
	CorsAllowOrigins string
	SpotifyClientID string
	SpotifyClientSecret string
	SpotifyRedirectURI string
	GeminiAPIKey string
}

// Load reads the configuration from environment variables
func Load() (*Config, error) {
	// Load environment variables from .env file if it exists
	_ = godotenv.Load() // ignoring error as .env file is optional

	return &Config{
		Port:               getEnv("PORT", "8080"),
		CorsAllowOrigins:   getEnv("CORS_ALLOW_ORIGINS", "*"),
		SpotifyClientID:    getEnv("SPOTIFY_CLIENT_ID", ""),
		SpotifyClientSecret: getEnv("SPOTIFY_CLIENT_SECRET", ""),
		SpotifyRedirectURI: getEnv("SPOTIFY_REDIRECT_URI", "http://localhost:8080/auth/callback"),
		GeminiAPIKey:       getEnv("GEMINI_API_KEY", ""),
	}, nil
}

// getEnv reads an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		return defaultValue
	}
	return value
}