# Use the official Node.js 18 Alpine image as the base
FROM node:18-alpine

WORKDIR /app

# Install dependencies before copying source code (for caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose Vite's default development port
EXPOSE 8080

# Run the development server
CMD ["npm", "run", "dev"]