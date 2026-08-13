# Step 1: Use an official lightweight Node.js base image
FROM node:20-alpine

# Step 2: Set working directory inside container
WORKDIR /usr/src/app

# Step 3: Copy package files first (to optimize Docker layer caching)
COPY package*.json ./

# Step 4: Install dependencies strictly based on lockfile
# Step 4: Install dependencies strictly based on lockfile
RUN npm ci --omit=dev

# Step 5: Copy application source code
COPY . .

# Step 6: Security - Run application as a non-root user
USER node

# Step 7: Expose port application listens on
EXPOSE 3000

# Step 8: Set default environment variable
ENV PORT=3000
ENV NODE_ENV=production

# Step 9: Define default execution command
CMD ["node", "server.js"]