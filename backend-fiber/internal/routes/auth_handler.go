package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/moodshift-app/backend/internal/services"
	"github.com/moodshift-app/backend/internal/utils"
)

// AuthHandler handles authentication-related routes
type AuthHandler struct {
	authService services.AuthService
	userService services.UserService
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService services.AuthService, userService services.UserService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		userService: userService,
	}
}

// InitiateSpotifyAuth redirects the user to Spotify's authorization page
func (h *AuthHandler) InitiateSpotifyAuth(c *fiber.Ctx) error {
	authURL := h.authService.GetAuthURL()
	return c.Redirect(authURL)
}

// HandleSpotifyCallback processes the callback from Spotify after authentication
func (h *AuthHandler) HandleSpotifyCallback(c *fiber.Ctx) error {
	code := c.Query("code")
	if code == "" {
		return utils.ErrorResponse(c, fiber.NewError(fiber.StatusBadRequest, "Missing authorization code"), fiber.StatusBadRequest)
	}

	// Exchange code for token and get user info
	user, token, err := h.authService.HandleCallback(code)
	if err != nil {
		return utils.ErrorResponse(c, err, fiber.StatusInternalServerError)
	}

	// Create response with token and user info
	return utils.SuccessResponse(c, fiber.Map{
		"token": token,
		"user":  user,
	})
}

// GetCurrentUser returns the currently authenticated user
func (h *AuthHandler) GetCurrentUser(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	
	user, err := h.userService.GetUserByID(userID)
	if err != nil {
		return utils.ErrorResponse(c, err, fiber.StatusInternalServerError)
	}
	
	return utils.SuccessResponse(c, user)
}