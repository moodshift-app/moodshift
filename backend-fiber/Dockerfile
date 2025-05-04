FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o moodshift-api ./cmd/main.go

# Use a small alpine image for the final container
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/moodshift-api .
# Copy the .env file if it exists (will be overridden by environment variables in production)
COPY --from=builder /app/.env* ./ 

EXPOSE 8080

# Run the binary
CMD ["./moodshift-api"]