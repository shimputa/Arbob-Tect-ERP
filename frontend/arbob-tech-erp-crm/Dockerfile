FROM node:18 as development

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000
ENV WDS_SOCKET_PORT=0

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

# Production stage
FROM node:18 as production

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --only=production

# Copy all files
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Build the app
RUN npm run build

# Start the app
CMD ["npm", "start"]