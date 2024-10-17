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

# Copy the runtime-env.js template
COPY public/runtime-env.js /usr/share/nginx/html/runtime-env.js

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx
EXPOSE 80

# Replace placeholders with actual environment variables at runtime
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/runtime-env.js > /usr/share/nginx/html/runtime-env.js && nginx -g 'daemon off;'"]
