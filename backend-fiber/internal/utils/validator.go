package utils

import (
	"errors"
	"strings"

	"github.com/go-playground/validator/v10"
)

// RequestValidator is a validator instance for validating requests
var RequestValidator = validator.New()

// ValidateStruct validates a struct based on validation tags
func ValidateStruct(s interface{}) error {
	err := RequestValidator.Struct(s)
	if err != nil {
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			messages := []string{}
			for _, e := range validationErrors {
				field := e.Field()
				tag := e.Tag()
				messages = append(messages, formatValidationError(field, tag, e.Param()))
			}
			return errors.New(strings.Join(messages, "; "))
		}
	}
	return err
}

// formatValidationError creates a human-readable error message for validation errors
func formatValidationError(field, tag, param string) string {
	switch tag {
	case "required":
		return field + " is required"
	case "min":
		return field + " must be at least " + param + " characters long"
	case "max":
		return field + " must be at most " + param + " characters long"
	case "email":
		return field + " must be a valid email address"
	case "url":
		return field + " must be a valid URL"
	default:
		return field + " failed validation for " + tag
	}
}