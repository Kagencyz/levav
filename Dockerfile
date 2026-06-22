# Levav Talent Afrika — Backend API Server
FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy built backend + frontend
COPY dist ./dist
COPY .env ./

EXPOSE 3000

CMD ["node", "dist/boot.js"]
