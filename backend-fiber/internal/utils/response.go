package utils

import (
	"github.com/gofiber/fiber/v2"
	"github.com/moodshift-app/backend/internal/models"
)

// SuccessResponse returns a standardized success response
func SuccessResponse(c *fiber.Ctx, data interface{}) error {
	return c.JSON(models.APIResponse{
		Success: true,
		Data:    data,
	})
}

// ErrorResponse returns a standardized error response
func ErrorResponse(c *fiber.Ctx, err error, statusCode int) error {
	return c.Status(statusCode).JSON(models.APIResponse{
		Success: false,
		Error:   err.Error(),
	})
}

// ValidationError returns a standardized validation error response
func ValidationError(c *fiber.Ctx, err error) error {
	return ErrorResponse(c, err, fiber.StatusBadRequest)
}

// UnauthorizedError returns a standardized unauthorized error response
func UnauthorizedError(c *fiber.Ctx) error {
	return ErrorResponse(c, fiber.ErrUnauthorized, fiber.StatusUnauthorized)
}

// NotFoundError returns a standardized not found error response
func NotFoundError(c *fiber.Ctx, message string) error {
	if message == "" {
		message = "Resource not found"
	}
	return c.Status(fiber.StatusNotFound).JSON(models.APIResponse{
		Success: false,
		Error:   message,
	})
}