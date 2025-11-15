FROM node:22-alpine

# Set the working directory inside the container.
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

# Expose the Fastify server port
EXPOSE 3001

CMD ["npm", "run", "dev"]
