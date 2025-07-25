# Use official Node.js image
FROM node:22

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps
RUN npm install -g vite

# Copy rest of the app (after installing deps)
COPY . .

# Expose Vite port
EXPOSE 5173

# Set entry point
CMD ["npm", "run", "dev"]