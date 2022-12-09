# Dockerfile designated to be used during development
FROM node:18.11.0-bullseye-slim

# Generic configuration
RUN mkdir /app/ /app/src/ /.npm/
WORKDIR /app

# Project configuration
ADD *.json *.js *.yaml *.yml /app/

# Permissions...
RUN chown -R node:node /app/ /.npm/ \
 && chmod -R 777 /app/ /.npm/
USER node

# Install the libraries
RUN npm install

ENTRYPOINT [ "npm" ]
