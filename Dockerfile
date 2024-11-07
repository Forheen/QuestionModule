#official Node.js 18 Alpine image as the base
FROM node:18-alpine

#working directory
WORKDIR /app

# Install dependencies before copying source code (for caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose Vite's default development port(can change according to requirement)    # Vite default port is 5173
EXPOSE 8082                     

# Run the development server
CMD ["npm", "run", "dev"]