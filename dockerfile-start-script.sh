#!/bin/bash
# Start Storybook in a screen session
echo "Starting Storybook in a screen session..."
screen -dmS storybook-session bash -c 'make storybook-start'

# Set DBus session address environment variable
export DBUS_SESSION_BUS_ADDRESS=unix:path=/run/dbus/system_bus_socket

# Start DBus service
echo "DBus service starting."
service dbus start

# Start Chromium headless
echo "Preparing to start Chromium in headless mode..."
screen -dmS chromium-session bash -c 'make chromium-start'
echo "Chromium started in headless mode."

# Keep the container running with bash
exec /bin/bash