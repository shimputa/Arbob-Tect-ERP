# Local Development Environment Variables when using postgres locally
DATABASE_URL="postgresql://postgres:root@localhost:5432/Arbob?schema=public"
PORT=3000
JWT_SECRET=hello123hdjmaKJGVSFFSKHKHSK
JWT_EXPIRES_IN=24h

# Docker Environment Variables  
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=arbob_tect_erp
DOCKER_DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}?schema=public

# JWT Configuration
DOCKER_JWT_SECRET=your_jwt_secret_key
DOCKER_JWT_EXPIRES_IN=30d

# API Configuration
REACT_APP_API_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
PORT=3000

# Frontend Development Settings
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
FAST_REFRESH=true
WDS_SOCKET_PORT=0
