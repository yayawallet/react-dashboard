FROM node:21-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm install --omit=dev

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Set appropriate file permissions
RUN chown -R nginx:nginx /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]