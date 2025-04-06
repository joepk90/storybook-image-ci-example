# Use the official Node 20.11.11 base image
FROM node:20.19-slim

ARG STARTUP_SCRIPT_FILE=dockerfile-start-script.sh
ARG STARTUP_SCRIPT_PATH=/usr/local/bin/$(STARTUP_SCRIPT_FILE)

# Set environment variables
ENV CHROME_PATH=Chrome/Chromium
ENV DBUS_SESSION_BUS_ADDRESS=unix:path=/run/dbus/system_bus_socket

# Install system dependencies for headless Chrome
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    make \
    chromium \
    screen \
    dbus \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# required for running on docker/linux arm64
RUN npm install @rollup/rollup-linux-arm64-gnu

# Copy the rest of your project
# COPY . .
COPY .storybook /app/.storybook

# Loki will launch Storybook for testing. Expose default Storybook port (optional)
EXPOSE 6006

COPY ./dockerfile-start-script.sh /usr/local/bin/./dockerfile-start-script.sh
RUN chmod +x /usr/local/bin/./dockerfile-start-script.sh

ENTRYPOINT ["/usr/local/bin/./dockerfile-start-script.sh"]