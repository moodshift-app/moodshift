package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/moodshift-app/backend/internal/middleware"
	"github.com/moodshift-app/backend/internal/services"
)

// SetupRoutes sets up all API routes
func SetupRoutes(app *fiber.App, authService services.AuthService, emotionService services.EmotionService, 
	playlistService services.PlaylistService, userService services.UserService) {

	// API v1 group
	api := app.Group("/api/v1")

	// Auth routes
	auth := api.Group("/auth")
	authHandler := NewAuthHandler(authService, userService)
	auth.Get("/spotify", authHandler.InitiateSpotifyAuth)
	auth.Get("/callback", authHandler.HandleSpotifyCallback)
	auth.Get("/me", middleware.Protected(), authHandler.GetCurrentUser)

	// Playlist routes
	playlists := api.Group("/playlists", middleware.Protected())
	playlistHandler := NewPlaylistHandler(playlistService, emotionService, userService)
	playlists.Post("/", playlistHandler.CreatePlaylist)
	playlists.Get("/", playlistHandler.GetUserPlaylists)
	playlists.Get("/:id", playlistHandler.GetPlaylistByID)
}