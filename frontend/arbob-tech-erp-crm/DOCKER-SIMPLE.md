# Docker Setup for Arbob-Tech-ERP-CRM Frontend

This document provides instructions for running the Arbob-Tech-ERP-CRM frontend application using Docker.

## Overview

This setup uses Node.js to serve your React application in development mode with hot reloading enabled, specifically configured for the Arbob-Tech-ERP-CRM project.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine (recommended)

## Environment Setup

Before running the application:

1. Create a `.env` file in the project root if you don't have one:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your specific configuration:
   - Set `REACT_APP_API_BASE_URL` to point to your backend API
   - Configure other environment variables as needed

## Running with Docker Compose (Recommended)

The easiest way to run the application is with Docker Compose:

```bash
# Build and start the container with hot reloading
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop the container
docker-compose down
```

## Running with Docker Directly

If you prefer to use Docker commands directly:

```bash
# Build the image
docker build -t arbob-tech-erp-frontend .

# Run the container with environment variables and volumes for hot reloading
docker run -p 3000:3000 -d \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/public:/app/public \
  -v $(pwd)/.env:/app/.env \
  -e CHOKIDAR_USEPOLLING=true \
  --name arbob-tech-erp-frontend \
  arbob-tech-erp-frontend

# View logs
docker logs -f arbob-tech-erp-frontend

# Stop the container
docker stop arbob-tech-erp-frontend
```

## Accessing the Application

Once running, access your application at:

http://localhost:3000

## Features of This Setup

- **Hot Reloading**: Changes to your React code will automatically refresh in the browser
- **Environment Variables**: Your `.env` file is mounted into the container
- **Development Mode**: React's development tools and error messages are enabled
- **Volume Mounting**: Source code changes are immediately reflected without rebuilding

## Troubleshooting

If you encounter issues:

1. **API Connection Issues**:
   - Check that your `.env` file has the correct `REACT_APP_API_BASE_URL`
   - Ensure your backend is running and accessible

2. **Hot Reloading Not Working**:
   - Verify that `CHOKIDAR_USEPOLLING=true` is set
   - Check that volumes are properly mounted

3. **Port Conflicts**:
   - If port 3000 is already in use, change the port mapping in docker-compose.yml:
     ```yaml
     ports:
       - "3001:3000"  # Map to a different host port
     ```

4. **Permission Issues**:
   - On Linux/Mac, you might need to adjust file permissions for mounted volumes

5. **Container Logs**:
   ```bash
   docker logs arbob-tech-erp-frontend
   ```

## Moving to Production

For production deployment:

1. Change `NODE_ENV=development` to `NODE_ENV=production` in Dockerfile and docker-compose.yml
2. Enable the build step: `RUN npm run build`
3. Consider using the Nginx-based Dockerfile for better performance 