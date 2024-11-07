# Use official Node.js 18 Alpine image as the base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose port 8081 (this should match the internal port Vite runs on)
EXPOSE 8081

# Run the development server
CMD ["npm", "run", "dev"]
