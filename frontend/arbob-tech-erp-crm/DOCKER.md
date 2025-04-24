# Dockerized Arbob-Tech-ERP-CRM Frontend

This document provides instructions on how to build and run the Arbob-Tech-ERP-CRM frontend application using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine (optional, but recommended)

## Environment Variables

Before building the Docker image, make sure you have the correct environment variables set:

1. Create a `.env` file based on the `.env.example` file.
2. Set the appropriate values for your environment, especially the API endpoint variables.

## Building and Running with Docker Compose (Recommended)

The easiest way to build and run the application is using Docker Compose:

```bash
# Build and start the containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the containers
docker-compose down
```

This will build the Docker image and start the container, making the application available at http://localhost:80.

## Building and Running with Docker Directly

If you prefer to use Docker commands directly:

```bash
# Build the Docker image
docker build -t arbob-tech-erp-crm-frontend .

# Run the container
docker run -p 80:80 -d --name arbob-tech-erp-crm-frontend arbob-tech-erp-crm-frontend

# Stop the container
docker stop arbob-tech-erp-crm-frontend

# Remove the container
docker rm arbob-tech-erp-crm-frontend
```

## Accessing the Application

Once the container is running, you can access the application at:

http://localhost:80

## Environment Configuration

When running in Docker, the environment variables are baked into the application at build time. If you need to change any environment variables:

1. Update your `.env` file
2. Rebuild the Docker image
3. Restart the container

## Troubleshooting

If you encounter any issues:

1. Check the container logs:
   ```bash
   docker logs arbob-tech-erp-crm-frontend
   ```

2. Ensure your Docker environment has enough resources allocated (memory, CPU).

3. If the application can't connect to your backend API, check the nginx configuration and ensure the API URL is correctly set.

## Production Considerations

For production deployment:

- Use a proper CI/CD pipeline to build and deploy the Docker image
- Consider using container orchestration like Kubernetes or Docker Swarm
- Implement proper monitoring and logging
- Set up HTTPS using a reverse proxy like Traefik or by configuring Nginx with SSL certificates 