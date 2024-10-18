# Build stage
FROM node:21-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build


# Server with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
