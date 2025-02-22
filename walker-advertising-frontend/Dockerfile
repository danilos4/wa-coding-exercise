# Use the official Node.js image as the base image
FROM node:lts-alpine AS build

# Set the working directory
WORKDIR /usr

# Copy package.json and package-lock.json
COPY walker-advertising-frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY walker-advertising-frontend .

# Build the Angular application
RUN npm run build --prod

# Use Nginx to serve the application
FROM nginx:alpine

# Copy the built Angular application from the build stage
COPY --from=build /usr/dist/walker-advertising-frontend/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]