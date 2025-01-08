# # Use official Node.js 18 Alpine image as the base
# FROM node:20-alpine

# # Set working directory
# WORKDIR /app

# # Copy dependency files and install dependencies
# COPY package.json package-lock.json ./
# RUN npm install

# # Copy the rest of the project files
# COPY . .

# # Expose port 8081 (this should match the internal port Vite runs on)
# EXPOSE 8080

# # Run the development server
# CMD ["npm", "run", "dev"]
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Add environment variables for Vite
ENV HOST=0.0.0.0
ENV PORT=5173

EXPOSE 5173

# Update command to use host flag
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
