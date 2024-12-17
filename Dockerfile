# Development environment
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose the app port
EXPOSE 4000

# Run the application in development mode
CMD ["npm", "run", "start:dev"]
