package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/moodshift-app/backend/internal/models"
	"github.com/moodshift-app/backend/internal/services"
	"github.com/moodshift-app/backend/internal/utils"
)

// PlaylistHandler handles playlist-related routes
type PlaylistHandler struct {
	playlistService services.PlaylistService
	emotionService  services.EmotionService
	userService     services.UserService
}

// NewPlaylistHandler creates a new playlist handler
func NewPlaylistHandler(playlistService services.PlaylistService, emotionService services.EmotionService, userService services.UserService) *PlaylistHandler {
	return &PlaylistHandler{
		playlistService: playlistService,
		emotionService:  emotionService,
		userService:     userService,
	}
}

// CreatePlaylist handles the creation of a new playlist based on emotional analysis
func (h *PlaylistHandler) CreatePlaylist(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	
	// Parse and validate request
	var req models.GeneratePlaylistRequest
	if err := c.BodyParser(&req); err != nil {
		return utils.ErrorResponse(c, err, fiber.StatusBadRequest)
	}
	
	if err := utils.ValidateStruct(req); err != nil {
		return utils.ValidationError(c, err)
	}
	
	// Analyze text for emotions
	emotionalAnalysis, err := h.emotionService.AnalyzeText(req.CurhatanText)
	if err != nil {
		return utils.ErrorResponse(c, err, fiber.StatusInternalServerError)
	}
	
	// Generate playlist
	playlist, err := h.playlistService.GeneratePlaylist(userID, req.CurhatanText, emotionalAnalysis, req.PlaylistName)
	if err != nil {
		return utils.ErrorResponse(c, err, fiber.StatusInternalServerError)
	}
	
	return utils.SuccessResponse(c, playlist)
}

// GetUserPlaylists returns all playlists for the current user
func (h *PlaylistHandler) GetUserPlaylists(c *fiber.Ctx) error {
	userID := c.Locals("userID").(string)
	
	playlists, err := h.playlistService.GetUserPlaylists(userID)
	if err != nil {
		return utils.ErrorResponse(c, err, fiber.StatusInternalServerError)
	}
	
	return utils.SuccessResponse(c, playlists)
}

// GetPlaylistByID returns a specific playlist by ID
func (h *PlaylistHandler) GetPlaylistByID(c *fiber.Ctx) error {
	playlistID := c.Params("id")
	if playlistID == "" {
		return utils.ErrorResponse(c, fiber.NewError(fiber.StatusBadRequest, "Missing playlist ID"), fiber.StatusBadRequest)
	}
	
	playlist, err := h.playlistService.GetPlaylistByID(playlistID)
	if err != nil {
		return utils.ErrorResponse(c, err, fiber.StatusInternalServerError)
	}
	
	if playlist == nil {
		return utils.NotFoundError(c, "Playlist not found")
	}
	
	return utils.SuccessResponse(c, playlist)
}