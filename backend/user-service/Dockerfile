FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Create necessary directories (uploads will be mounted as volume)
RUN mkdir -p logs

# Expose port
EXPOSE 3002

# Start application
CMD ["npm", "start"]

