# Stage 1: Base image for development
FROM node:current-alpine AS development

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application files
COPY . .

# Expose application port for development
EXPOSE 3000

# Start the application in development mode
CMD ["npm", "run", "start:dev"]

# Stage 2: Build the application for production
FROM node:current-alpine AS build

WORKDIR /app

# Copy package files and install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm install

# Copy source files and build the application
COPY . .
RUN npm run build

# Stage 3: Production image
FROM node:current-alpine AS production

WORKDIR /app

# Copy the production build and dependencies
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Expose the application port
EXPOSE 3000

# Start the application in production mode
CMD ["node", "dist/main"]
