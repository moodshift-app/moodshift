package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/moodshift-app/backend/config"
	"github.com/moodshift-app/backend/internal/routes"
	"github.com/moodshift-app/backend/internal/services"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Create Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			// Default error handler
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"success": false,
				"error":   err.Error(),
			})
		},
	})

	// Middleware
	app.Use(recover.New())
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: cfg.CorsAllowOrigins,
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
			"info":   "MoodShift API is running",
		})
	})

	// TODO: Initialize services
	// This section would typically include setting up your services with database connections
	// For now, we'll just use placeholder nil services which should be replaced with real implementations
	var authService services.AuthService
	var emotionService services.EmotionService
	var playlistService services.PlaylistService
	var userService services.UserService

	// Register routes
	routes.SetupRoutes(app, authService, emotionService, playlistService, userService)

	// Start server
	log.Printf("Starting server on port %s...", cfg.Port)
	log.Fatal(app.Listen(":" + cfg.Port))
}