# Script to build all services with buildx and run with docker-compose

Write-Host "Building all services with buildx..." -ForegroundColor Green

# Build all services with buildx
docker buildx build --platform linux/amd64 --load -t event-service:latest ./event-service
docker buildx build --platform linux/amd64 --load -t api-gateway:latest ./api-gateway
docker buildx build --platform linux/amd64 --load -t auth-service:latest ./auth-service
docker buildx build --platform linux/amd64 --load -t user-service:latest ./user-service
docker buildx build --platform linux/amd64 --load -t payment-service:latest ./payment-service

Write-Host "Build completed! Starting services with docker-compose..." -ForegroundColor Green

# Run docker-compose
docker-compose up

