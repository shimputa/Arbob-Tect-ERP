FROM node:18

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies using regular npm install instead of npm ci
RUN npm install

# Copy all files
COPY . .

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Expose port - default React port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:dev"]